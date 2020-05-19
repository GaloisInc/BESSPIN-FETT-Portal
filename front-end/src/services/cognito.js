import { Auth } from 'aws-amplify';

const generator = require('generate-password');

const password = generator.generate({
  length: 10,
  numbers: true,
});

export const createUser = async username => {
  try {
    const user = await Auth.signUp({
      username,
      password,
      attributes: {
        'custom:role': 'admin',
      },
    });
    console.log(`${username} successfully created ${user}`);
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const createTeams = async teamNumber => {
  console.log(`creating ${teamNumber} teams --> IMPLEMENT`);
};

export const updateUser = async teamNumber => {
  console.log(`updating user --> IMPLEMENT`);
};
