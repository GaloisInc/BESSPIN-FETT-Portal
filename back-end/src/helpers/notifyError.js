const aws = require('aws-sdk');

const sns = new aws.SNS();
const ALARM_TOPIC = process.env.alarmTopicArn;

class NotifyError {
  constructor(error, context) {
    this.functionName = context.functionName;
    this.error = NotifyError.makeError(error);
  }

  async send() {
    const err = this.error;
    const func = this.functionName;
    await sns
      .publish({
        Subject: 'fettportal Error',
        Message: JSON.stringify({ error: err, function: func }),
        TopicArn: ALARM_TOPIC,
      })
      .promise();
  }

  static makeError(error) {
    if (typeof error === 'string' || error instanceof Error) {
      return error.toString();
    }
    JSON.stringify(error);
  }
}

module.exports = NotifyError;
