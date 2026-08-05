import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
import { ChainablePromiseElement } from 'webdriverio'

class RedeCredenciadaAndroid extends BaseScreen {
    // ====== SELECTORS ======
    get redeTab(){
        return $('//android.widget.TextView[@text="Rede"]')
    }

    get inputSearch() {
        return $('id:com.astl.vidalink.beta:id/btSearchLocal')
    }

    get pharmacy() {
        return $('//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/nav_tab"]/*[contains(@text, "Farmácias")]')
    }

    get manipulation() {
        return $('//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/nav_tab"]/*[contains(@text, "Manipulados")]')
    }

    get vaccine() {
        return $('//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/nav_tab"]/*[contains(@text, "Vacinas")]')
    }

    get iconChangeSearch() {
        return $('id:com.astl.vidalink.beta:id/ivChangeSearchType')
    }

    get listStores() {
        return $('id:com.astl.vidalink.beta:id/rvPharmacyList')
    }

    get firstStore() {
        return '(//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/clPharmacySearchDialog"])[1]'
    }

    get storeName() {
        return $(`${this.firstStore}//*[@resource-id="com.astl.vidalink.beta:id/tvPharmacyName"]`)
    }

    get storeAddress() {
        return $(`${this.firstStore}//*[@resource-id="com.astl.vidalink.beta:id/tvPharmacyAddress"]`)
    }

    get storeDistance() {
        return $(`${this.firstStore}//*[@resource-id="com.astl.vidalink.beta:id/tvPharmacyDistance"]`)
    }

    get btnRoute() {
        return `//*[contains(@text, "Traçar Rota")]`
    }

    // ======== ACTIONS ========
    async viewScreenRedeCredenciada() {
        await this.inputSearch.waitForDisplayed({ timeout: 10000 })
        await this.pharmacy.waitForDisplayed({ timeout: 10000 })
        await this.manipulation.waitForDisplayed({ timeout: 10000 })
        await this.iconChangeSearch.waitForDisplayed({ timeout: 50000 })
    }

    async viewListStores() {
        const storeList = this.listStores
        const firstPharmacy = this.firstStore

        await this.increaseSearchRadius()

        await storeList.waitForDisplayed({ timeout: 30000 })
        await $(firstPharmacy).waitForDisplayed({ timeout: 10000 })

        const PharmacyName = await this.storeName.getText()
        const PharmacyAddress = await this.storeAddress.getText()
        const PharmacyDistance = await this.storeDistance.getText()
        await $(`${this.firstStore}${this.btnRoute}`).waitForExist()

        console.log(`Nome farmácia: ${PharmacyName} | Endereço farmácia: ${PharmacyAddress} | Distância farmácia: ${PharmacyDistance}`)
    }

    async increaseSearchRadius() {
        const btnLetsGo = $('//android.widget.Button[@text="Vamos lá"]')
        if (await btnLetsGo.isExisting()) {
            await this.checkpointScreen('Hmmm… Não encontramos Manipulados próximos(as) do endereço buscado, mas você pode ampliar seu campo de busca em até 10 vezes.')
            await btnLetsGo.click()
        }
    }

    async traceRouteToPharmacy() {

        await this.waitAndClick($(`(${this.btnRoute})[1]`))

        if (await this.btnSkipAndroid.isExisting()) {
            await this.waitAndClick(this.btnSkipAndroid)
        }

        await $(this.placeCardAndroid).waitForDisplayed({ timeout: 50000 })
    }

    // ======== METHODS ========
    async navigateToRedeCredenciada() {
        await this.viewScreenRedeCredenciada()
        await this.waitAndClick(this.iconChangeSearch)
        await this.viewListStores()

        await this.waitAndClick(this.manipulation)
        await this.viewListStores()

        if (await this.vaccine.isExisting()) {
            await this.waitAndClick(this.vaccine)
            await this.viewListStores()
        }
        await this.traceRouteToPharmacy()
    }

    async validateRedeAfinidade() {
        await this.redeTab.click()
        await this.inputSearch.waitForDisplayed({ timeout: 10000 })
        await this.pharmacy.waitForDisplayed({ timeout: 10000 })
        await this.iconChangeSearch.waitForDisplayed({ timeout: 50000 })
        await this.waitAndClick(this.iconChangeSearch)
        await this.viewListStores()
    }

}
export default new RedeCredenciadaAndroid()