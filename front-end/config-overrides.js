const rewireReactHotLoader = require('react-app-rewire-hot-loader');

/* config-overrides.js */
module.exports = function override(config, env) {
  /* eslint no-param-reassign: 0 */
  config = rewireReactHotLoader(config, env);
  return config;
};
