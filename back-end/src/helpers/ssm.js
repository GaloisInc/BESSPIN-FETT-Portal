const AWS = require('aws-sdk');

const awsssm = new AWS.SSM();
class SsmHelper {
  static async getParameter(path) {
    try {
      const request = {
        Name: path,
        WithDecryption: true,
      };
      const response = await awsssm
        .getParameter(request)
        .promise()
        .catch(e => {
          console.log(e);
          throw e;
        });
      if (
        response != null &&
        response !== undefined &&
        response.Parameter !== undefined &&
        response.Parameter.Value !== undefined
      ) {
        return response.Parameter.Value;
      }
    } catch (e) {
      throw new Error('Error retrieving parameter');
    }
  }

  static async getParametersByPath(path) {
    try {
      const request = {
        Path: path,
        WithDecryption: true,
        Recursive: true,
      };
      const response = await awsssm
        .getParametersByPath(request)
        .promise()
        .catch(e => {
          console.log(e);
          throw e;
        });
      if (response.Parameters) {
        const params = {};
        for (const p of response.Parameters) {
          params[p.Name.split('/').pop()] = p.Value;
        }
        return params;
      }
    } catch (e) {
      throw new Error('Error retrieving parameter');
    }
  }

  static async putNewValue(path, value) {
    try {
      const params = {
        Name: path,
        Type: 'SecureString',
        Value: value,
        Description: `updated at ${new Date().toLocaleString()}`,
        Overwrite: true,
      };
      await awsssm
        .putParameter(params)
        .promise()
        .catch(e => {
          console.log(e);
          throw e;
        });
    } catch (e) {
      throw e;
    }
  }
}
module.exports = SsmHelper;
