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
  mochaOpts: { timeout: 240000 },

  before: async function () {
    await globalBeforeEach()
  },

  afterTest: globalAfterEach,

  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:platformVersion': '16.0',
      'appium:automationName': 'UiAutomator2',
      'appium:app': path.join(process.cwd(), 'app', 'VidalinkBeta_des_v591.apk'),

      'appium:autoGrantPermissions': true,
      'appium:uiautomator2ServerLaunchTimeout': 120000,
      'appium:autoLaunch': true,
      'appium:adbExecTimeout': 120000,
      'appium:newCommandTimeout': 180,
      'appium:noReset': false,
      'appium:dontStopAppOnReset': true,
      'appium:fullReset': false,
      'appium:noSign': true,
      'appium:appWaitActivity': '*',
      'appium:appWaitDuration': 30000,
      'appium:disableWindowAnimation': true,
    },
  ],
} satisfies Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] }