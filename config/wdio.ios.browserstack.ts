import type { Options } from '@wdio/types'
import 'dotenv/config'
import { setBSName, setBSTestAnnotation, setBSTestResult } from '../support/hooks/global.hooks.js'

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

  before: async function (capabilities, specs) {
    await setBSName(specs);
  },

  beforeTest: async function (test) {
    await setBSTestAnnotation(test);
  },

  afterTest: async function (test, context, result) {
    await setBSTestResult(test, context, result);
  },

  capabilities: [{
    'platformName': 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:bundleId': 'br.com.vidalink.beta',
    'appium:app': 'bs://26a5a4c8546f7aa1770c4b82d40471ea94870bea', //v5.10.2
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