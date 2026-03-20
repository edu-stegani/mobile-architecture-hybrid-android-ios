import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeIOS extends BaseScreen {

    // ====== SELECTORS ======
    get labelNewApp() {
        return $('')
    }

    get closeNewApp() {
        return $('')
    }

    get homeTab() {
        return $('')
    }

    get selectorHelloUser() {
        return $('')
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

    // ======== METHODS ========
    async checkDashboard() {
        await this.closeInfoNewApp()
        await this.checkHomeIcon()
    }

    async tapCardByText(cardText: string) {
        const cardName = ``
        await this.scrollToElement(cardName)
        await this.waitAndClick($(cardName))
    }

}

export default new HomeIOS()