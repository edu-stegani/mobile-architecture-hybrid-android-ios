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
    const message = `▶️ Início: ${test.title}`

    console.log(message);

    await browser.execute('browserstack_executor: ' + JSON.stringify({
      action: 'annotate',
      arguments: {
        data: message,
        level: 'info'
      }
    }))
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

  afterTest: async function (test, context, { error, passed }) {
    const message = passed
      ? `✅ Sucesso: ${test.title}`
      : `❌ Falha: ${test.title} - ${error?.message}`

    await browser.execute('browserstack_executor: ' + JSON.stringify({
      action: 'annotate',
      arguments: {
        data: message,
        level: passed ? 'info' : 'error'
      }
    }))

    // Verifica status do teste e marca como passed ou failed na BrowserStack
    await browser.execute('browserstack_executor: ' + JSON.stringify({
      action: 'setSessionStatus',
      arguments: {
        status: passed ? 'passed' : 'failed',
        reason: passed ? 'Teste OK!' : error?.message
      }
    }))
  },

  capabilities: [{
    'platformName': 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:bundleId': 'br.com.vidalink.beta',
    'appium:app': 'bs://f442d272ee44d5ce5487674204fad9150d236ec5', //v5.10.1
    'appium:includeSafariInWebviews': true,

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