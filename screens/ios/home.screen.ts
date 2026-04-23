import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeIOS extends BaseScreen {

    // ====== SELECTORS ======
    get btnPular() {
        return $('//XCUIElementTypeButton[@label="Pular"]');
    }

    get closeIcon() {
        return $('~ic close black')
    }

    get homeTab() {
        return $('//XCUIElementTypeButton[@name="Home"]')
    }

    get selectorHelloUser() {
        return $('')
    }

    // ======== ACTIONS ========
    async closeTutorial() {
        try {
            await this.btnPular.waitForDisplayed({ timeout: 10000 });
            const close = this.closeIcon
            await this.waitAndClick(close)
            await close.waitForDisplayed({ reverse: true, timeout: 10000 });
        } catch (e) { }
    }

    async checkHomeIcon() {
        await driver.pause(5000);
        await this.homeTab.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    async helloUser(firstName: string) {
        const helloUser = $(`-ios predicate string:label ==[c] "Olá, ${firstName}!"`);
        await helloUser.waitForDisplayed({ timeout: 30000 });
    }

    // ======== METHODS ========
    async checkDashboard() {
        await this.acceptFullAccessGalery()
        await this.acceptPermissionAlertLocation()
        await this.closeTutorial()
        await this.checkHomeIcon()
    }

    async tapCardByText(cardText: string) {
        const cardName = `//XCUIElementTypeCell//XCUIElementTypeStaticText[@name="${cardText}"]`
        await this.scrollToElement(cardName)
        await this.waitAndClick($(cardName))
    }

    async tapPilarByName(pilarName: string) {
        const pilarSelector = `//XCUIElementTypeStaticText[@label="${pilarName}. Botão."]/..//XCUIElementTypeOther`
        await this.scrollToElement(pilarSelector)
        await this.waitAndClick($(pilarSelector))
    }
}

export default new HomeIOS()