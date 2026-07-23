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

    get homeCard(){
        return $('')
    }

    get iconConfiguration(){
        return $('')
    }

    get pillars360(){
        return $(``)
    }

    // ======== ACTIONS ========
    async closeTutorial() {
        await this.btnPular.waitForDisplayed({ timeout: 10000 });
        const close = this.closeIcon
        await this.waitAndClick(close)
        await close.waitForDisplayed({ reverse: true, timeout: 10000 });
    }

    async maintenanceNotice() {
        await this.btnNotShowAgain.waitForDisplayed({ timeout: 10000 })
        await this.btnNotShowAgain.click()
    }

    async HowAboutEvaluatingUs() {
        const btnNoThanks = this.btnNoThanks
        await this.checkpointScreen('Que tal avaliar nosso aplicativo?')
        await this.waitAndClick(btnNoThanks)
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
        // try { await this.closeTutorial() } catch(e){ }
        // try { await this.maintenanceNotice() } catch (e) { console.log('Aviso de manutenções não visível') }
        // try { await this.HowAboutEvaluatingUs() } catch (e) { console.log('Solicitação de avaliação não visível.') }
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

    async validateHomeAfinidade(){
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

export default new HomeIOS()