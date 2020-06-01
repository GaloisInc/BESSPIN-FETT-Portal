import { v4 as uuidv4 } from 'uuid';
import { createEnvironmentRecord } from './api/environment';

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
