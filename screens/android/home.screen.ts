import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get labelNewApp() {
        return $('//android.widget.TextView[@text="Novo app, nova estrutura"]')
    }

    get closeNewApp() {
        return $('id=com.astl.vidalink.beta:id/ivClose')
    }

    get homeTab() {
        return $('//android.widget.TextView[@text="Home"]')
    }

    get selectorHelloUser() {
        return $('id=com.astl.vidalink.beta:id/tvGreeting')
    }

    // ======== ACTIONS ========
    async closeInfoNewApp() {
        try {
            await this.labelNewApp.waitForDisplayed({ timeout: 10000 })
            await this.waitAndClick(this.closeNewApp)
            await this.closeNewApp.waitForDisplayed({ reverse: true, timeout: 10000 })
        } catch (error) {
            console.log('Info Novo App não apareceu, continuando com o teste...')
        }
    }

    async checkHomeIcon() {
        await this.homeTab.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    async helloUser(firstName: string) {
        await this.selectorHelloUser.waitForDisplayed({ timeout: 30000, interval: 2000 })

        const greeting = await this.selectorHelloUser.getText()
        await expect(greeting).toContain(`Olá, ${firstName}!`)
    }

    // ======== METHODS ========
    async checkDashboard() {
        await this.closeInfoNewApp()
        await this.checkHomeIcon()
    }

    async tapCardByText(cardText: string) {
        const cardName = `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvTitle" and @text="${cardText}"]`
        await this.scrollToElement(cardName)
        await this.waitAndClick($(cardName))
    }

    async tapPilarByName(pilarName: string) {
        const pilarSelector = `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvPillarName" and @text="${pilarName}"]`
        await this.scrollToElement(pilarSelector)
        await this.waitAndClick($(pilarSelector))
    }

}

export default new HomeAndroid()