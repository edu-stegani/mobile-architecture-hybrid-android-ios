import type { Options } from '@wdio/types'
import 'dotenv/config'
import { setBSSessionName, setBSTestAnnotation, setBSTestResult } from '../support/hooks/global.hooks.js'

const buildName = `iOS_Build_${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

export const config: Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] } = {
  runner: 'local',

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  protocol: 'https',
  hostname: 'hub.browserstack.com',
  port: 443,
  path: '/wd/hub',

  specs: ['../tests/specs/**/*.ts'],

  maxInstances: 1,

  framework: 'mocha',
  logLevel: 'error', 
  services: [
    ['browserstack', {
      browserstackLocal: true,
      opts: { verbose: false }
    }]
  ],
  reporters: [
    ['allure', { outputDir: 'allure-results' }]
  ],

  mochaOpts: {
    timeout: 600000
  },

  beforeTest: async function (test) {
    await setBSSessionName(test.title);
    await setBSTestAnnotation(test);
  },

  afterTest: async function (test, context, result) {
    await setBSTestResult(test, context, result);
  },

  capabilities: [{
    'platformName': 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:bundleId': 'br.com.app-beta-exemplo.beta',
    'appium:app': 'bs://xxxxxxxxxxxxxxxxxxxxxxxxx',
    'appium:includeSafariInWebviews': true,

    'bstack:options': {
      deviceName: 'iPhone 15',
      osVersion: '17',
      projectName: 'QA Mobile TS',
      buildName: buildName,
      debug: true,
      networkLogs: false,
      'local': true
    } as any
  }]
}