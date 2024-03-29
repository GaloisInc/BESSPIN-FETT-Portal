import {
  createEnvironmentRecord,
  terminateEnvironment,
  forceTerminateEnvironment,
  resetTarget,
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
      ...configuration,
    };
    console.log(environmentRecord);
    try {
      if (newStatus === 'forcing' || configuration.Status === 'provisioning') {
        const response = await forceTerminateEnvironment(environmentRecord);
        resolve(response);
      } else if (newStatus === 'terminating') {
        const response = await terminateEnvironment(environmentRecord);
        resolve(response);
      } else if (newStatus === 'resetting') {
        console.log('resetting');
        const response = await resetTarget(environmentRecord);
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
