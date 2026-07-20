import path from 'node:path'
import type { Options } from '@wdio/types'
import { globalBeforeEach, globalAfterEach } from '../support/hooks/global.hooks.js'

export const config = {
  runner: 'local',
  port: 4723,
  path: '/',
  specs: ['../tests/specs/**/*.ts'],
  framework: 'mocha',
  logLevel: 'error',
  maxInstances: 1,
  waitforTimeout: 30000,
  waitforInterval: 1000,
  services: ['appium'],
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results'
    }]
  ],
  mochaOpts: { timeout: 240000 },

  before: async function () {
    await globalBeforeEach()
  },

  beforeTest: function (test, context) {
    console.log(`▶️  Runing Scenario: ${test.title}`);
  },

  afterTest: globalAfterEach,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 16 Plus',
      'appium:platformVersion': '18.4',
      'appium:automationName': 'XCUITest',

      'appium:app': path.join(process.cwd(), 'app', 'VidalinkBeta_v5_10_5.app'),

      'appium:autoAcceptAlerts': true,
      'appium:autoGrantPermissions': true,
      'appium:autoLaunch': true,
      'appium:newCommandTimeout': 240,
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:showXcodeLog': false,
    },
  ],
} satisfies Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] }