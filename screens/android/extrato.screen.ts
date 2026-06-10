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
    // ======== ACTIONS ========

    // ======== METHODS ========
    async validationScreenExtrato(name: string) {
        const tituloEconomizei = this.tittleSaved
        const ultimosMeses = this.lastMonths
        const valorEconomizado = this.valueSaved
        const cardReport = this.cardReport
        const cardReportAndName = `${cardReport}//*[contains(@text, "${name}")]`
        const btnVerCompras = this.btnSeePurchases

        await tituloEconomizei.waitForDisplayed({ interval: 1000 })
        await ultimosMeses.waitForDisplayed({ interval: 1000 })
        await expect(valorEconomizado).toBeDisplayed({ interval: 1000 })
        await expect($(cardReport)).toBeDisplayed({ interval: 1000 })
        await expect($(cardReportAndName)).toBeDisplayed({ interval: 1000 })
        await expect(btnVerCompras).toBeDisplayed({ interval: 1000 })
    }
}
export default new ExtratoAndroid()