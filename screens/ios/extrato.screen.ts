import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ExtratoIOS extends BaseScreen {
    // ====== SELECTORS ======
    get tittleSaved() {
        return $('')
    }

    get lastMonths() {
        return $('')
    }

    get valueSaved() {
        return $('')
    }

    get cardReport() {
        return ''
    }

    get btnSeePurchases() {
        return $('')
    }

    get dashboardSubsidyBalance() {
        return $('')
    }

    get selectUserFamily() {
        return $('')
    }

    get mesesExtrato() {
        return $('')
    }

    get abaMonth(){
        return ``
    }

    get monthsSummary(){
        return $('')
    }

    // ======== ACTIONS ========
    async viewScreenExtrato(name: string) {
        const tituloEconomizei = this.tittleSaved
        const ultimosMeses = this.lastMonths
        const valorEconomizado = this.valueSaved
        const cardReport = this.cardReport
        const cardReportAndName = `${cardReport}//*[contains(@text, "${name}")]`
        const dashboardSubsidyBalance = this.dashboardSubsidyBalance

        await tituloEconomizei.waitForDisplayed({ interval: 1000 })
        await ultimosMeses.waitForDisplayed({ interval: 1000 })
        await expect(valorEconomizado).toBeDisplayed({ interval: 1000 })
        await expect($(cardReport)).toBeDisplayed({ interval: 1000 })
        await expect($(cardReportAndName)).toBeDisplayed({ interval: 1000 })

        try {
            await dashboardSubsidyBalance.waitForDisplayed({ timeout: 10000, interval: 1000 })
        } catch (e) { console.log('Dashboard saldo subsídio não visível, massa CT Pirelli.') }
    }

    async seePurchases() {
        const btnVerCompras = this.btnSeePurchases
        const selectUserFamily = this.selectUserFamily
        const mesesExtrato = this.mesesExtrato
        const mes = this.abaMonth
        const mes1 = `(${mes})[1]`
        const mes2 = `(${mes})[2]`
        const minhasDespesas = this.monthsSummary

        await this.waitAndClick(btnVerCompras)

        await selectUserFamily.waitForDisplayed({ interval: 1000 })
        await expect(mesesExtrato).toBeDisplayed({ interval: 1000 })

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