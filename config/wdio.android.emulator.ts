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
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '16.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': path.join(process.cwd(), 'app', 'Vidalink-betaDebug-5_10_1.apk'),

    'appium:appPackage': 'com.astl.vidalink.beta',
    'appium:appWaitActivity': '*',
    'appium:noReset': false,
    'appium:fullReset': false,

    'appium:autoGrantPermissions': true,
    'appium:uiautomator2ServerLaunchTimeout': 120000,
    'appium:autoLaunch': true,
    'appium:adbExecTimeout': 120000,
    'appium:newCommandTimeout': 180,
    'appium:dontStopAppOnReset': true,
    'appium:noSign': true,
    'appium:appWaitDuration': 30000,
    'appium:disableWindowAnimation': true,
  }],
} satisfies Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] }