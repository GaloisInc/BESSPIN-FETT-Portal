import { v4 as uuidv4 } from 'uuid';
import { createEnvironmentRecord, updateEnvironmentStatus } from './api/environment';

export const ec2Launcher = async configuration =>
  new Promise(async (resolve, reject) => {
    // TODO => Implement Launcher
    try {
      const dummyEC2Response = { F1EnvironmentId: uuidv4(), IpAddress: '198.162.0.0', Region: 'us-west-2', Status: 'running' };
      const environmentRecord = {
        Configuration: configuration.Id,
        ...dummyEC2Response,
      };
      const response = await createEnvironmentRecord(environmentRecord);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const ec2StatusUpdate = async (configuration, newStatus) =>
  new Promise(async (resolve, reject) => {
    // TODO => Implement EC2 SDK status update
    const environmentRecord = {
      Id: configuration.F1EnvironmentId,
      Status: newStatus,
    };
    console.log(environmentRecord);
    try {
      const response = await updateEnvironmentStatus(environmentRecord);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
