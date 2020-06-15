import { v4 as uuidv4 } from 'uuid';
import { createEnvironmentRecord, updateEnvironmentStatus } from './api/environment';

export const ec2Launcher = async configuration =>
  new Promise(async (resolve, reject) => {
    // TODO => Implement Launcher
    console.log(configuration);
    try {
      const environmentRecord = {
        Configuration: configuration.Id,
        Type: configuration.Type,
        Processor: configuration.Processor,
        OS: configuration.OS,
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
      Id: configuration.Id,
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
