const aws = require('aws-sdk');
const { CloudWatch, Database, SsmHelper } = require('../../helpers');

const db = new Database();
const sqs = new aws.SQS();
const stopInstance = async (instanceId, region) => {
  const ec2 = new aws.EC2({ region });
  const params = {
    InstanceIds: [instanceId],
    DryRun: false,
    Force: false,
  };
  return ec2.stopInstances(params).promise();
};
const updateDBForTermination = async instanceId => {
  console.log('updating for termination');
  return db.query(
    `UPDATE Environment set Status = "terminated" WHERE F1EnvironmentId = :instanceId`,
    { instanceId }
  );
};
const updateDBForStarted = async (instanceId, instanceIp, fpgaIp) => {
  console.log('updating for started');
  return db.query(
    `UPDATE Environment set IpAddress = :instanceIp, FPGAIp = :fpgaIp, Status = "running" WHERE F1EnvironmentId = :instanceId`,
    { instanceId, instanceIp, fpgaIp }
  );
};
const getEnvironmentConfig = async instanceId =>
  db.query(`SELECT * FROM Environment WHERE F1EnvironmentId = :instanceId`, {
    instanceId,
  });

const getInstanceConfig = async instanceId =>
  db.query(
    `SELECT ev.*, ic.*, u.* FROM Environment ev LEFT JOIN InstanceConfiguration ic on ic.Id = ev.Configuration_FK LEFT JOIN User u on u.Id = ev.CreatedBy_FK WHERE ev.F1EnvironmentId = :instanceId`,
    { instanceId }
  );
const getPassword = async username => {
  const password = await SsmHelper.getParameter(
    `/fettportal/credentials/${username}`
  );
  return password;
};

exports.handler = async event => {
  await db.makeConnection();
  for (const msg of event.Records) {
    console.log(msg);
    const message = JSON.parse(msg.body);
    const signal = message.job.reason.split('-').pop();
    const envConf = await getEnvironmentConfig(message.instance.id);
    console.log('environment config', envConf);
    if (signal === 'termination') {
      try {
        await stopInstance(message.instance.id, envConf[0].Region);
      } catch (e) {
        if (e.code === 'InvalidInstanceID.NotFound') {
          console.log('msg', e.message);
          console.log('Instance has already gone away');
        } else {
          throw e;
        }
      }
      await updateDBForTermination(message.instance.id);
      await CloudWatch.deleteDashboards(message.instance.id);
    }
    if (signal === 'deployment' && message.job.status === 'success') {
      const instanceId = message.instance.id;
      const instanceIp = message.instance['instance-ip'];
      const fpgaIp = message.instance['fpga-ip'];
      await updateDBForStarted(instanceId, instanceIp, fpgaIp);
      await CloudWatch.putDashboard(instanceId);
    } else if (signal === 'deployment' && message.job.status === 'failure') {
      // tear down instance and start over
      try {
        await stopInstance(message.instance.id);
      } catch (e) {
        if (e.code === 'InvalidInstanceID.NotFound') {
          console.log('msg', e.message);
          console.log('Instance has already gone away');
        } else if (e.code === 'IncorrectInstanceState') {
          console.log('msg', e.message);
          console.log('Instance is likely already in a stopped state');
        } else {
          throw e;
        }
      }
      let instanceConfigData = await getInstanceConfig(message.instance.id);
      console.log('top', instanceConfigData);
      [instanceConfigData] = instanceConfigData;
      console.log('bottom', instanceConfigData);
      console.log('instance config', instanceConfigData);
      const pass = await getPassword(instanceConfigData.UserName);
      const messageBody = {
        Id: instanceConfigData.Id,
        Type: instanceConfigData.Type,
        OS: instanceConfigData.OS,
        Processor: instanceConfigData.Processor,
        ConfigurationKey: instanceConfigData.Configuration_FK,
        Region: instanceConfigData.Region,
        username: instanceConfigData.UserName,
        password: pass,
        creatorId: instanceConfigData.CreatedBy_FK,
      };
      const msgParams = {
        QueueUrl: process.env.RESEARCHER_INITIALIZATION_QUEUE_URL,
        MessageBody: JSON.stringify(messageBody),
        MessageDeduplicationId: String(messageBody.creatorId),
        MessageGroupId: String(messageBody.Id),
      };
      await sqs.sendMessage(msgParams).promise();
      await CloudWatch.deleteDashboards(message.instance.id);
    }
  }
};
