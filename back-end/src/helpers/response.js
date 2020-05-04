class Response {
  constructor(message) {
    this.message = message;
  }

  success() {
    try {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.message),
      };
    } catch (e) {
      this.message = e;
      this.fail();
    }
  }

  fail() {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: this.makeResponse(),
      }),
    };
  }

  makeResponse() {
    if (typeof this.message === 'string') {
      return this.message;
    }
    if (this.message instanceof Error) {
      return this.message.toString();
    }
    if (typeof this.message === 'object') {
      return JSON.stringify(this.message);
    }
    return this.message.toString();
  }
}

module.exports = { Response };
