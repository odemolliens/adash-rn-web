const { withExpoAdapter } = require('@expo/electron-adapter');

module.exports = withExpoAdapter({
  projectRoot: __dirname,
  whiteListedModules: ['swr', 'react-chartjs-2'],
  // Provide any overrides for electron-webpack: https://github.com/electron-userland/electron-webpack/blob/master/docs/en/configuration.md
});
