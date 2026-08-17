import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class DashboardIOS extends BaseScreen {

    // ====== SELECTORS ======

    get labelNewApp() {
        return $('')    // precisa mapear no ios
    }

    get closeNewApp() {
        return $('//XCUIElementTypeButton[@name="ic close black"]')
    }

    get homeTab() {
        return $('')    // precisa mapear no ios
    }

    get selectorHelloUser() {
        return $('//XCUIElementTypeStaticText[contains(@label, "Olá, ")]')
    }

    get cardBeneficios() {
        return $(`(//XCUIElementTypeCell/XCUIElementTypeStaticText)[2]`)
    }

    // ======== ACTIONS ========

    async closeInfoNewApp() {
        try {
            await this.labelNewApp.waitForDisplayed({ timeout: 20000 })

            await this.waitAndClick(this.closeNewApp)

            await this.closeNewApp.waitForDisplayed({
                reverse: true,
                timeout: 10000
            })

        } catch (error) {
            console.log('Info Novo App não apareceu, continuando com o teste...')
        }
    }

    async checkHomeIcon() {
        await this.homeTab.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    async helloUser(firstName: string) {
        await this.selectorHelloUser.waitForDisplayed({
            timeout: 30000,
            interval: 2000
        })

        const greeting = await this.selectorHelloUser.getValue()
        const firstNameUpper = firstName.toUpperCase();
        expect(greeting).toContain(`Olá, ${firstNameUpper}!`)
    }

    async checkUserCard(fullName: string) {
        await this.cardBeneficios.waitForDisplayed({
            timeout: 30000,
            interval: 2000
        })

        const cardText = await this.cardBeneficios.getValue()
        
        expect(cardText).toContain(fullName)
    }

    // ======== METHODS ========

    async checkDashboard() {
        await this.closeInfoNewApp()
        await this.checkHomeIcon()
    }

    async checkUserName(firstName: string, fullName: string) {
        await this.helloUser(firstName)
        await this.checkUserCard(fullName)
    }

    async tapCardByText(cardText: string) {
        const cardCadReceita = $(`//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvTitle" and @text="${cardText}"]`) // precisa mapear no ios
        await this.waitAndClick(cardCadReceita)
    }

}

export default new DashboardIOS()