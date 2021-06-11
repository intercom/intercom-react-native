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
      platformName: 'Android',
      platformVersion: '10',
      deviceName: 'Android_29',
      app: '../android/app/build/outputs/apk/foss/release/app-foss-release.apk',
      automationName: 'UiAutomator2',
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
