import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get btnPular() {
        return $('id:com.astl.vidalink.beta:id/btNext')
    }

    get closeIcon() {
        return $('id=com.astl.vidalink.beta:id/ivClose')
    }

    get homeTab() {
        return $('//android.widget.TextView[@text="Home"]')
    }

    get selectorHelloUser() {
        return $('id=com.astl.vidalink.beta:id/tvGreeting')
    }

    // ======== ACTIONS ========
    async closeTutorial() {
        try {
            await this.btnPular.waitForDisplayed({ timeout: 20000 })
            const close = this.closeIcon
            await this.waitAndClick(close)
            await close.waitForDisplayed({ reverse: true, timeout: 10000 })
        } catch (error) { }
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
        await this.closeTutorial()
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