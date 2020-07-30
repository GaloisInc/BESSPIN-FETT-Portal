import {
  createEnvironmentRecord,
  terminateEnvironment,
  forceTerminateEnvironment,
  rebootTarget,
} from './api/environment';

export const ec2Launcher = async configuration =>
  new Promise(async (resolve, reject) => {
    console.log(configuration);
    try {
      const environmentRecord = {
        Configuration: configuration.Id,
        Type: configuration.Type,
        Processor: configuration.Processor,
        OS: configuration.OS,
        Variant: configuration.Variant,
      };
      const response = await createEnvironmentRecord(environmentRecord);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const ec2StatusUpdate = async (configuration, newStatus) =>
  new Promise(async (resolve, reject) => {
    const environmentRecord = {
      Id: configuration.Id,
      Status: newStatus,
      F1EnvironmentId: configuration.F1EnvironmentId,
    };
    console.log(environmentRecord);
    try {
      if (newStatus === 'forcing') {
        const response = await forceTerminateEnvironment(environmentRecord);
        resolve(response);
      } else if (newStatus === 'terminating') {
        const response = await terminateEnvironment(environmentRecord);
        resolve(response);
      } else if (newStatus === 'rebooting') {
        console.log('rebooting');
        const response = await rebootTarget(environmentRecord);
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
