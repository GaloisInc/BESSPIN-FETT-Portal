import { Auth } from 'aws-amplify';

const generator = require('generate-password');

const password = generator.generate({
  length: 10,
  numbers: true,
});

export const createUser = async (username, role) => {
  try {
    const user = await Auth.signUp({
      username,
      password,
      attributes: {
        'custom:role': role,
      },
    });
    console.log(`${username} successfully created ${user}`);
    return user;
  } catch (error) {
    console.log(error);
  }
};
