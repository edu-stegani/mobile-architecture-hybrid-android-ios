import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeIOS extends BaseScreen {

    // ====== SELECTORS ======
    get btnPular() {
        return $('//XCUIElementTypeButton[@label="Pular"]');
    }

<<<<<<< HEAD
    get closeIcon() {
=======
    get closeNewApp() {
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
        return $('~ic close black')
    }

    get homeTab() {
        return $('//XCUIElementTypeButton[@name="Home"]')
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
        }
    }

    async checkHomeIcon() {
        await driver.pause(5000);
<<<<<<< HEAD
        await this.homeTab.waitForDisplayed({ timeout: 60000, interval: 2000 })
=======
        await this.homeTab.waitForDisplayed({ timeout: 40000, interval: 2000 })
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
    }

    async helloUser(firstName: string) {
        const helloUser = $(`-ios predicate string:label ==[c] "Olá, ${firstName}!"`);
        await helloUser.waitForDisplayed({ timeout: 30000 });
    }

    // ======== METHODS ========
    async checkDashboard() {
<<<<<<< HEAD
        await this.acceptFullAccessGalery()
        await this.acceptPermissionAlertLocation()
        // await this.closeTutorial()
        // await this.maintenanceNotice()
        await this.HowAboutEvaluatingUs()
=======
        await this.acceptPermissionAlertLocation()
        await this.closeInfoNewApp()
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
        await this.checkHomeIcon()
    }

    async tapCardByText(cardText: string) {
        const cardName = `//XCUIElementTypeCell//XCUIElementTypeStaticText[@name="${cardText}"]`
        await this.scrollToElement(cardName)
        await this.waitAndClick($(cardName))
    }

<<<<<<< HEAD
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
=======
    // //XCUIElementTypeButton[@name="Allow Full Access"]
    // //XCUIElementTypeButton[@name="Allow While Using App"]

>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
}

export default new HomeIOS()