const aws = require('aws-sdk');
const moment = require('moment');

const { Database } = require('../../helpers');

const db = new Database();
const s3 = new aws.S3();

const getEC2List = (region, keyName) => {
  const EC2 = new aws.EC2({ region });
  const params = {
    Filters: [
      {
        Name: 'instance-type',
        Values: ['f1.2xlarge'],
      },
      {
        Name: 'instance-state-name',
        Values: ['stopped'],
      },
      {
        Name: 'key-name',
        Values: [keyName],
      },
    ],
  };
  return EC2.describeInstances(params).promise();
};

const reapInstances = region =>
  new Promise(async (resolve, reject) => {
    try {
      const EC2 = new aws.EC2({ region });
      const keyName =
        region === 'us-west-2'
          ? 'researcher-uswest-f1key'
          : 'researcher-useast-f1key';
      console.log(region);
      const instances = await getEC2List(region, keyName);
      const instancesForTermination = [];
      instances.Reservations.forEach(res => {
        console.log(res.Instances);
        if (res.Instances && res.Instances[0] && res.Instances[0].LaunchTime) {
          const launchTime = moment(res.Instances[0].LaunchTime);
          const hoursSinceLaunch = Math.abs(launchTime.diff(moment(), 'hours'));
          console.log('HOURS SINCE LAUNCH', hoursSinceLaunch);
          if (hoursSinceLaunch > 24)
            instancesForTermination.push(res.Instances[0].InstanceId);
        }
      });
      console.log('INSTANCES BEING TERMINATED', instancesForTermination);
      if (instancesForTermination.length > 0) {
        await EC2.terminateInstances({
          InstanceIds: instancesForTermination,
        }).promise();
      }
      resolve('success');
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });

exports.handler = async (event, context) => {
  try {
    await reapInstances('us-west-2');
    await reapInstances('us-east-1');
  } catch (err) {
    console.log(err);
  }
};
