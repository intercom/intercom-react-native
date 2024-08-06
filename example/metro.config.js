const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');
const pak = require('../package.json');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const config = {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
