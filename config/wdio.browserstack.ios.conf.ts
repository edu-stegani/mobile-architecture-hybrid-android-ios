import type { Options } from '@wdio/types'
import 'dotenv/config'

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
  services: ['browserstack'],
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results'
    }]
  ],

  mochaOpts: {
    timeout: 240000
  },

  beforeTest: async function (test) {
    // Atualiza o nome da sessão no BrowserStack para o nome do teste atual
    await driver.execute(`browserstack_executor: {"action": "setSessionName", "arguments": {"name": "${test.title}"}}`);
  },

  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    const status = passed ? "passed" : "failed";
    const reason = error ? error.message : "Teste finalizado com sucesso";

    await driver.execute(
      `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status": "${status}", "reason": "${reason}"}}`
    );
  },

  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',

    'appium:app': 'bs://4e57a5dc95859106c6a54bb3b0dab40ce2a8e12d',

    'appium:autoAcceptAlerts': true,

    'bstack:options': {
      deviceName: 'iPhone 15',
      osVersion: '17',

      projectName: 'QA Mobile TS',
      buildName: `iOS_Build_${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,

      debug: true,
      networkLogs: true
    }
  }]
}