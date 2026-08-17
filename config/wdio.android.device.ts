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
    console.log(`▶️  Runing Scenario: ${test.title}`);
  },

  afterTest: globalAfterEach,

  capabilities:
    [{
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Galaxy_S25',
      'appium:udid': 'RQGL209A1AA',
      'appium:app': path.join(process.cwd(), 'app', 'app-beta-exemplo.apk'),
      'appium:appPackage': 'com.astl.app-beta-exemplo.beta',
      'appium:appWaitActivity': '*',
      'appium:appWaitDuration': 30000,
      'appium:appWaitPackage': 'com.astl.vidalink.beta',
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
      'appium:noReset': true,
      'appium:fullReset': false,
    }]
} satisfies Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] }