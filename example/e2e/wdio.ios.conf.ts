exports.config = {
  appium: { command: 'appium' },

  runner: 'local',
  port: 4723,
  specs: ['./tests/**/*.e2e.ts'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 1,
      browserName: '',
      automationName: 'XCUITest',
      platformName: 'iOS',
      platformVersion: '14.4',
      deviceName: 'iPhone 8',
      app: './build/Build/Products/Release-iphonesimulator/IntercomReactNativeExample.app',
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
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
