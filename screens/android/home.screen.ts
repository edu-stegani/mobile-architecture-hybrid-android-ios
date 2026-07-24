import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class HomeAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get btnPular() {
        return $('id:com.astl.vidalink.beta:id/tvPrevious')
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

    get btnNotShowAgain() {
        return $('//XCUIElementTypeButton[@name="Não exibir novamente"]')
    }

    get btnNoThanks() {
        return $('id:com.astl.vidalink.beta:id/btDisagree')
    }

    get homeCard() {
        return $('id:com.astl.vidalink.beta:id/cvHomeCard')
    }

    get iconConfiguration() {
        return $('id:com.astl.vidalink.beta:id/ibConfiguration')
    }

    get pillars360(){
        return $(`id:com.astl.vidalink.beta:id/tvPillarsLabel`)
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
        await this.homeTab.waitForDisplayed({ timeout: 50000, interval: 2000 })
    }

    async helloUser(firstName: string) {
        await this.selectorHelloUser.waitForDisplayed({ timeout: 30000, interval: 2000 })

        const greeting = await this.selectorHelloUser.getText()
        await expect(greeting).toContain(`Olá, ${firstName}!`)
    }

    // ======== METHODS ========
    async checkDashboard() {
        // await this.closeTutorial()
        // await this.maintenanceNotice()
        await this.HowAboutEvaluatingUs()
        await this.homeTab.waitForDisplayed({ timeout: 60000, interval: 2000 })
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

    async validateHomeAfinidade() {
        await this.homeCard.waitForDisplayed()
        await this.iconConfiguration.waitForDisplayed()
    }

    async onlyOnePillarOn360(name: string) {
        const onlyOnePillar = `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvPillarName"`
        const pilarMed = `${onlyOnePillar} and @text="${name}"]`
        await this.scrollToElement(pilarMed)
        await this.pillars360.waitForDisplayed()

        await $(`${onlyOnePillar}]`).waitForDisplayed()
    }

}

export default new HomeAndroid()