const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pak = require('../package.json');
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const modules = Object.keys({
  ...pak.peerDependencies,
});
const config = {
  resolver: {
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
  watchFolders: [root],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
