import path from 'node:path'
import type { Options, Frameworks } from '@wdio/types'
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
  connectionRetryTimeout: 300000,
  services: ['appium'],
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results'
    }]
  ],
  mochaOpts: { timeout: 600000 },

  before: async function () {
    await globalBeforeEach()
  },

  beforeTest: function (test, context) {
    console.log(`▶️  Running Scenario: ${test.title}`);
  },

  afterTest: globalAfterEach,

  capabilities:
    [{
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': 'iPhone 13', 
      'appium:udid': '00008110-000824E63E86201E',
      'appium:platformVersion': '26.5',
      'appium:app': path.join(process.cwd(), 'app', 'app-beta-exemplo.ipa'), 
      'appium:bundleId': 'br.com.app-beta-exemplo.beta', 
      'appium:newCommandTimeout': 240,
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:autoAcceptAlerts': true, 
      'appium:updatedWDABundleId': 'com.estegani.WebDriverAgentRunner',
      'appium:showXcodeLog': true
    }]
} satisfies Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] }