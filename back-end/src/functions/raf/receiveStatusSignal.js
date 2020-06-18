const aws = require('aws-sdk');
const { CloudWatch, Database } = require('../../helpers');

const ec2 = new aws.EC2();
const db = new Database();

const stopInstance = async instanceId => {
  const params = {
    InstanceIds: [instanceId],
    DryRun: false,
    Force: false,
  };
  return ec2.stopInstances(params).promise();
};
const updateDBForTermination = async instanceId =>
  db.query(
    `UPDATE Environment set Status = "terminated" WHERE F1EnvironmentId = :instanceId`,
    { instanceId }
  );
const updateDBForStarted = async (instanceId, instanceIp, fpgaIp) => {
  console.log('updating for started');
  await db.query(
    `UPDATE Environment set IpAddress = :instanceIp, FPGAIp = :fpgaIp, Status = "running" WHERE Id = :instanceId`,
    { instanceId, instanceIp, fpgaIp }
  );
};
const getInstanceConfig = async (instanceId, instanceIp, fpgaIp) => {
  await db.query(
    `UPDATE Environment set IpAddress = :instanceIp, FPGAIp = :fpgaIp Status = "Started" WHERE Id = :instanceId`,
    { instanceId, instanceIp, fpgaIp }
  );
};
exports.handler = async event => {
  await db.makeConnection();
  for (const msg of event.Records) {
    console.log(msg);
    const message = JSON.parse(msg.body);
    const signal = message.job.reason.split('-').pop();
    if (signal === 'termination') {
      await stopInstance(message.instance.id);
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
      await stopInstance(message.instance.id);
      await getInstanceConfig(message.instance.id);
      await CloudWatch.deleteDashboards(message.instance.id);
    }
  }
};
