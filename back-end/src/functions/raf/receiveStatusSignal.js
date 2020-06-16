const aws = require('aws-sdk');
const { Response, Database } = require('../../helpers');

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
    `UPDATE Environment set Status = "Stopped" WHERE F1EnvironmentId = :instanceId`,
    { instanceId }
  );
const updateDBForStarted = async (instanceId, instanceIp, fpgaIp) => {
  await db.query(
    `UPDATE Environment set IpAddress = :instanceIp, FPGAIp = :fpgaIp Status = "Started" WHERE Id = :instanceId`,
    { instanceId, instanceIp, fpgaIp }
  );
};
exports.handler = async event => {
  for (const msg of event.Records) {
    const message = JSON.parse(msg.body);
    if (message.job.status === 'terminated') {
      await stopInstance(message.instance.id);
      await updateDBForTermination(message.instance.id);
    }
    if (message.job.status === 'started') {
      const instanceId = message.instance.id;
      const instanceIp = message.instance['instance-ip'];
      const fpgaIp = message.instance['fpga-ip'];
      await updateDBForStarted(instanceId, instanceIp, fpgaIp);
    }
  }
};
