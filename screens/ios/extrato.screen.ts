import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ExtratoIOS extends BaseScreen {
    // ====== SELECTORS ======
    get extratoTab(){
        return $(``)
    }

    get tittleSaved() {
        return $('//XCUIElementTypeStaticText[contains(@name, "Economizei: R$")]')
    }

    get lastMonths() {
        return $('//XCUIElementTypeStaticText[contains(@name, "nos últimos 12 meses")]')
    }

    get cardReport() {
        return '//XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther'
    }

    get btnSeePurchases() {
        return $('//XCUIElementTypeButton[contains(@name, "compras")]')
    }

    get dashboardValueDisponible() {
        return '//XCUIElementTypeStaticText[contains(@name, "Disponível R$")]'
    }

    get dashboardSubsidy(){
        return $('//XCUIElementTypeStaticText[@name="Saldo do Subsídio"]')
    }

    get selectUserFamily() {
        return $('//XCUIElementTypeButton[contains(@name, "Compras")]')
    }

    get abaMonth(){
        return `//XCUIElementTypeCollectionView/XCUIElementTypeCell`
    }

    get monthsSummary(){
        return $('~Minhas despesas:')
    }

    // ======== ACTIONS ========
    async viewScreenExtrato(name: string) {
        const tituloEconomizei = this.tittleSaved
        const ultimosMeses = this.lastMonths
        const cardReport = this.cardReport
        const cardReportAndName = `${cardReport}//*[contains(@name, "${name}")]`
        const dashboardSubsidy = this.dashboardSubsidy
        const dashboardSaldo = `(${this.dashboardValueDisponible})[2]`

        await tituloEconomizei.waitForDisplayed({ interval: 1000 })
        await ultimosMeses.waitForDisplayed({ interval: 1000 })
        await expect($(cardReport)).toBeDisplayed({ interval: 1000 })

        try {
            await dashboardSubsidy.waitForDisplayed({ timeout: 10000, interval: 1000 })
            await $(dashboardSaldo).waitForDisplayed({ timeout: 10000, interval: 1000 })
        } catch (e) { console.log('Dashboard saldo subsídio não visível, massa CT Pirelli.') }
        
        await this.SwipeLeftCoordinates(450)
        await expect($(cardReportAndName)).toBeDisplayed({ interval: 1000 })
    }

    async seePurchases() {
        const btnVerCompras = this.btnSeePurchases
        const selectUserFamily = this.selectUserFamily
        const mes = this.abaMonth
        const mes1 = `(${mes})[1]`
        const mes2 = `(${mes})[2]`
        const minhasDespesas = this.monthsSummary

        await this.waitAndClick(btnVerCompras)

        await selectUserFamily.waitForDisplayed({ interval: 1000 })

        await this.waitAndClick($(mes2))
        await this.waitAndClick($(mes1))

        await minhasDespesas.waitForDisplayed({ interval: 1000 })
    }

    // ======== METHODS ========
    async validationScreenExtrato(name: string) {
        await this.viewScreenExtrato(name)
        await this.seePurchases()
    }
}
export default new ExtratoIOS()