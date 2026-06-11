import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ExtratoAndroid extends BaseScreen {
    // ====== SELECTORS ======
    get tittleSaved() {
        return $('id:com.astl.vidalink.beta:id/tvSubTitle')
    }

    get lastMonths() {
        return $('id:com.astl.vidalink.beta:id/tvLastMonths')
    }

    get valueSaved() {
        return $('id:com.astl.vidalink.beta:id/tvValueSaved')
    }

    get cardReport() {
        return '//androidx.cardview.widget.CardView[@resource-id="com.astl.vidalink.beta:id/mcvReport"]'
    }

    get btnSeePurchases() {
        return $('id:com.astl.vidalink.beta:id/btSeePurchases')
    }

    get dashboardSubsidyBalance() {
        return $('id:com.astl.vidalink.beta:id/includeTwoReport')
    }

    get selectUserFamily() {
        return $('id:com.astl.vidalink.beta:id/tvSelectUserFamily')
    }

    get mesesExtrato() {
        return $('id:com.astl.vidalink.beta:id/rvMonths')
    }

    get abaMonth(){
        return `//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/clRoot"]`
    }

    get monthsSummary(){
        return $('id:com.astl.vidalink.beta:id/includeMonthSummary')
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

        try {
            await dashboardSubsidyBalance.waitForDisplayed({ timeout: 10000, interval: 1000 })
        } catch (e) { console.log('Dashboard saldo subsídio não visível, massa CT Pirelli.') }

        await this.SwipeLeftCoordinates(500)
        await expect($(cardReportAndName)).toBeDisplayed({ interval: 1000 })
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
export default new ExtratoAndroid()