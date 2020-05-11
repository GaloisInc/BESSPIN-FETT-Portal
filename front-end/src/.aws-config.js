module.exports = {
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  AppWebDomain: process.env.REACT_APP_COGNITO_DOMAIN, 
  TokenScopesArray: [
    'phone',
    'email',
    'profile',
    'openid',
    'aws.cognito.signin.user.admin',
  ],
  RedirectUriSignIn: process.env.REACT_APP_REDIRECT_URI,
  RedirectUriSignOut: process.env.REACT_APP_LOGOUT_REDIRECT_URI,
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, 
  AdvancedSecurityDataCollectionFlag: false,
};
