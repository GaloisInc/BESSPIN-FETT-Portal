const aws = require('aws-sdk');

const cw = new aws.CloudWatch();

const createTemplate = (f1, region) => ({
  start: '-PT6H',
  periodOverride: 'inherit',
  widgets: [
    {
      type: 'text',
      x: 0,
      y: 0,
      width: 9,
      height: 2,
      properties: {
        markdown: `\n# Instance Dashboard\n## Id: ${f1}\n`,
      },
    },
    {
      type: 'metric',
      x: 0,
      y: 2,
      width: 9,
      height: 9,
      properties: {
        view: 'timeSeries',
        stacked: false,
        metrics: [['AWS/EC2', 'CPUUtilization', 'InstanceId', `${f1}`]],
        region: 'us-west-2',
      },
    },
    {
      type: 'metric',
      x: 9,
      y: 0,
      width: 9,
      height: 9,
      properties: {
        view: 'timeSeries',
        stacked: false,
        metrics: [
          ['AWS/EC2', 'NetworkIn', 'InstanceId', `${f1}`],
          ['.', 'NetworkOut', '.', '.'],
        ],
        region: `${region}`,
        title: 'Network Activity',
      },
    },
    {
      type: 'metric',
      x: 18,
      y: 6,
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        stacked: false,
        metrics: [
          ['AWS/EC2', 'DiskReadBytes', 'InstanceId', `${f1}`],
          ['.', 'DiskWriteBytes', '.', '.'],
          ['.', 'DiskReadOps', '.', '.'],
          ['.', 'DiskWriteOps', '.', '.'],
        ],
        region: `${region}`,
        title: 'Disk Reads/Writes',
      },
    },
    {
      type: 'metric',
      x: 18,
      y: 0,
      width: 6,
      height: 6,
      properties: {
        view: 'timeSeries',
        stacked: false,
        metrics: [
          ['AWS/EC2', 'StatusCheckFailed', 'InstanceId', `${f1}`],
          ['.', 'StatusCheckFailed_Instance', '.', '.'],
          ['.', 'StatusCheckFailed_System', '.', '.'],
        ],
        region: `${region}`,
        title: 'Status Checks',
      },
    },
  ],
});

class CloudWatch {
  static async putDashboard(instanceId, region) {
    try {
      const dashParams = {
        DashboardBody: JSON.stringify(createTemplate(instanceId, region)),
        DashboardName: `FettPortal${instanceId}`,
      };
      const response = await cw
        .putDashboard(dashParams)
        .promise()
        .catch(e => {
          console.log(e);
          throw e;
        });
      return response;
    } catch (e) {
      console.log(`Error adding dashboard ${e}`);
      throw new Error(`Error adding dashboard ${e}`);
    }
  }

  static async deleteDashboards(instanceId) {
    try {
      const dashParams = {
        DashboardNames: [`FettPortal${instanceId}`],
      };
      const response = await cw
        .deleteDashboards(dashParams)
        .promise()
        .catch(e => {
          console.log(e);
          throw e;
        });
      return response;
    } catch (e) {
      console.log(`Error adding dashboard ${e}`);
      throw new Error(`Error removing dashboard`);
    }
  }
}
module.exports = CloudWatch;
