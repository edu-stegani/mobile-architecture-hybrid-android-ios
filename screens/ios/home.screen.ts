import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeIOS extends BaseScreen {

    // ====== SELECTORS ======
    get btnPular() {
        return $('//XCUIElementTypeButton[@label="Pular"]');
    }

    get closeNewApp() {
        return $('~ic close black')
    }

    get homeTab() {
        return $('//XCUIElementTypeButton[@name="Home"]')
    }

    get selectorHelloUser() {
        return $('')
    }

    // ======== ACTIONS ========
    async closeInfoNewApp() {
        try {
            await this.btnPular.waitForDisplayed({ timeout: 10000, timeoutMsg: 'botão pular modal não visivel' })
            console.log('Modal Novo app detectado, fechando...');
            const close = this.closeNewApp
            await this.waitAndClick(close)

            await this.closeNewApp.waitForDisplayed({ reverse: true, timeout: 10000 });
        } catch (error) {
            console.log('Modal novo app não visível, seguindo pra home...');
        }
    }

    async checkHomeIcon() {
        await driver.pause(5000);
        await this.homeTab.waitForDisplayed({ timeout: 40000, interval: 2000 })
    }

    async helloUser(firstName: string) {
        const helloUser = $(`-ios predicate string:label ==[c] "Olá, ${firstName}!"`);
        await helloUser.waitForDisplayed({ timeout: 30000 });
    }

    // ======== METHODS ========
    async checkDashboard() {
        await this.acceptPermissionAlertLocation()
        await this.closeInfoNewApp()
        await this.checkHomeIcon()
    }

    async tapCardByText(cardText: string) {
        const cardName = `//XCUIElementTypeCell//XCUIElementTypeStaticText[@name="${cardText}"]`
        await this.scrollToElement(cardName)
        await this.waitAndClick($(cardName))
    }

    // //XCUIElementTypeButton[@name="Allow Full Access"]
    // //XCUIElementTypeButton[@name="Allow While Using App"]

}

export default new HomeIOS()