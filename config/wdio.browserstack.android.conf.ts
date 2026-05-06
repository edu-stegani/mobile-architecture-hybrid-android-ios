import type { Options } from '@wdio/types'
import 'dotenv/config'
import path from 'node:path'
import { setBSName, setBSTestAnnotation, setBSTestResult } from '../support/hooks/global.hooks.js'

const buildName = `Android_Build_${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

export const config: Options.Testrunner & { capabilities: WebdriverIO.Capabilities[] } = {
    runner: 'local',

    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,

    protocol: 'https',
    hostname: 'hub.browserstack.com',
    port: 443,
    path: '/wd/hub',

    connectionRetryTimeout: 240000,
    connectionRetryCount: 5,
    waitforTimeout: 60000,

    specs: ['../tests/specs/**/*.ts'],

    framework: 'mocha',
    logLevel: 'silent',

    services: [
        ['browserstack', {
            browserstackLocal: true,
            opts: { verbose: false }
        }]
    ],

    reporters: [
        ['allure', {
            outputDir: 'allure-results'
        }]
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
        'platformName': 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:app': 'bs://b36d0594efefdf30ca1015618c5097a46b8e70c8',
        'appium:appPackage': 'com.astl.vidalink.beta',
        
        'appium:autoGrantPermissions': true,

        'bstack:options': {
            deviceName: 'Google Pixel 8',
            osVersion: '14.0',
            projectName: 'QA Mobile TS',
            buildName: buildName,
            debug: true,
            networkLogs: false
        }
    }]
}