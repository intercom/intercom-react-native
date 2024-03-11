const packageJson = require('./package.json');

const pkg = {
  // Prevent this plugin from being run more than once.
  // This pattern enables users to safely migrate off of this
  // out-of-tree `@config-plugins/intercom-react-native` to a future
  // upstream plugin in `intercom-react-native`
  name: packageJson.name,
  // Indicates that this plugin is dangerously linked to a module,
  // and might not work with the latest version of that module.
  version: packageJson.version,
};

const plugin = require('./lib/commonjs/expo-plugins');

module.exports = plugin.default(pkg);
