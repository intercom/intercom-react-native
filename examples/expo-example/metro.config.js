const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const libraryRoot = path.resolve(__dirname, '..', '..');

const config = getDefaultConfig(__dirname);
config.resolver.unstable_enableSymlinks = true;
config.watchFolders = [libraryRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];
config.resolver.blockList = [
  new RegExp(path.resolve(libraryRoot, 'node_modules') + '/.*'),
];

module.exports = withNativeWind(config, { input: './global.css' });
