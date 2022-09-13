exports.config = {
  appium: { command: 'appium' },

  runner: 'local',
  specs: ['./tests/**/*.e2e.ts'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 1,
      browserName: '',
      automationName: 'XCUITest',
      platformName: 'iOS',
      platformVersion: '16.0',
      deviceName: 'iPhone 11 Pro',
      app: 'build/Build/Products/Release-iphonesimulator/IntercomReactNativeExampleUI.app',
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 220000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  before() {
    require('./helpers');
  },
  featureFlags: {
    specFiltering: true,
  },
};
