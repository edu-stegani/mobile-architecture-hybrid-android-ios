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

    get btnNotShowAgain() {
        return $('//XCUIElementTypeButton[@name="Não exibir novamente"]')
    }

    get btnNoThanks() {
        return $('~btnNotNow')
    }

    get iconConfiguration() {
        return $('~ic config')
    }

    get pillars360() {
        return $(`//XCUIElementTypeStaticText[@name="Bem-estar 360°"]`)
    }

    // ======== ACTIONS ========
    async closeTutorial() {
        if (await this.btnPular.isDisplayed()) {
            const close = this.closeIcon
            await this.waitAndClick(close)
            await close.waitForDisplayed({ reverse: true, timeout: 10000 });
        }
    }

    async maintenanceNotice() {
        if (await this.btnNotShowAgain.isDisplayed()) {
            await this.btnNotShowAgain.click()
        }
    }

    async HowAboutEvaluatingUs() {
        const btnNoThanks = this.btnNoThanks
        if (await btnNoThanks.isDisplayed()) {
            await this.checkpointScreen('Que tal avaliar nosso aplicativo?')
            await this.waitAndClick(btnNoThanks)
        }
    }

    async checkHomeIcon() {
        await driver.pause(5000);
        await this.homeTab.waitForDisplayed({ timeout: 60000, interval: 2000 })
    }

    async helloUser(firstName: string) {
        const helloUser = $(`-ios predicate string:label ==[c] "Olá, ${firstName}!"`);
        await helloUser.waitForDisplayed({ timeout: 30000 });
    }

    // ======== METHODS ========
    async checkDashboard() {
        await this.acceptFullAccessGalery()
        await this.acceptPermissionAlertLocation()
        // await this.closeTutorial()
        // await this.maintenanceNotice()
        await this.HowAboutEvaluatingUs()
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

    async validateHomeAfinidade() {
        await this.acceptFullAccessGalery()
        await this.acceptPermissionAlertLocation()
        await this.iconConfiguration.waitForDisplayed()
    }

    async onlyOnePillarOn360(name: string) {
        const onlyOnePillar = `//XCUIElementTypeCollectionView[@name="cvPillarsIdentifier"]/XCUIElementTypeCell`
        const pilarMed = `//XCUIElementTypeStaticText[@label="${name}. Botão."]/..//XCUIElementTypeOther`
        await this.scrollToElement(pilarMed)
        await this.pillars360.waitForDisplayed()
        await $(onlyOnePillar).waitForDisplayed()
    }
}

export default new HomeIOS()