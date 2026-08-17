import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class DashboardAndroid extends BaseScreen {

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

    get cardBeneficios() {
        return $(`id=com.astl.vidalink.beta:id/tvCardHolderName`)
    }

    // ======== ACTIONS ========
    async closeInfoNewApp() {
        try {
            await this.labelNewApp.waitForDisplayed({ timeout: 20000 })
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

    async checkUserCard(fullName: string) {
        await this.cardBeneficios.waitForDisplayed({ timeout: 30000, interval: 2000 })

        const cardText = await this.cardBeneficios.getText()
        await expect(cardText).toContain(fullName)
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
        const cardCadReceita = `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvTitle" and @text="${cardText}"]`
        await this.scrollToElement(cardCadReceita)
        await this.waitAndClick($(cardCadReceita))
    }

}

export default new DashboardAndroid()