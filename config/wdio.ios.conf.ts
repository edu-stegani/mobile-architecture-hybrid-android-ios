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

  beforeTest: async function () {
    await globalBeforeEach()
  },

  afterTest: globalAfterEach,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 15',
      'appium:platformVersion': '17.0',
      'appium:automationName': 'XCUITest',

      'appium:app': path.join(process.cwd(), 'app', 'VidalinkBeta_v5_10_1.ipa'),

      'appium:autoAcceptAlerts': true,
      'appium:autoGrantPermissions': true, 
      'appium:permissions': JSON.stringify({
        "br.com.vidalink.beta": {
          "photos": "yes",
          "camera": "yes",
          "medialibrary": "yes"
        }
      }),
      'appium:autoLaunch': true,
      'appium:newCommandTimeout': 180,
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:showXcodeLog': false,
    },
  ],
} satisfies Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] }