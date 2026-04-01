import type { Options } from '@wdio/types'
import 'dotenv/config'
import path from 'node:path'

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
      browserstackLocal: false,
      opts: {
        verbose: false
      }
    }]
  ],
  reporters: [
    // 'spec',
    ['allure', {
      outputDir: 'allure-results'
    }]
  ],

  mochaOpts: {
    timeout: 600000
  },

  beforeTest: async function (test) {
    console.log(`▶️  Runing Scenario: ${test.title}`);
  },

  before: async function (capabilities, specs) {
    const specPath = specs[0]

    const specName = path.basename(specPath)

    await browser.execute('browserstack_executor: ' + JSON.stringify({
      action: 'setSessionName',
      arguments: {
        name: specName
      }
    }))
  },

  afterTest: function (test, context, { error, result, duration, passed, retries }) {
    if (passed) {
      browser.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed", "reason": "Teste OK!"}}', []);
    } else {
      browser.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed", "reason": "${error.message}"}}`, []);
    }
  },

  capabilities: [{
    'platformName': 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:bundleId': 'br.com.vidalink.beta',
    'appium:app': 'bs://f442d272ee44d5ce5487674204fad9150d236ec5', //v5.10.1
    'appium:includeSafariInWebviews': true,
    'appium:autoAcceptAlerts': true,
    'appium:permissions': '{"br.com.vidalink.beta": {"location": "always"}}',

    'bstack:options': {
      deviceName: 'iPhone 15',
      osVersion: '17',
      projectName: 'QA Mobile TS',
      buildName: buildName,
      debug: true,
      networkLogs: false
    }
  }]
}