import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class RedeCredenciadaIOS extends BaseScreen {
    // ====== SELECTORS ======
    get inputSearch() {
        return $('//XCUIElementTypeTextField[@value="Buscar..."]')
    }

    get pharmacy() {
        return $('//XCUIElementTypeCell/XCUIElementTypeOther//*[contains(@name, "Farmácias")]')
    }

    get manipulation() {
        return $('//XCUIElementTypeCell/XCUIElementTypeOther//*[contains(@name, "Manipulados")]')
    }

    get vaccine() {
        return $('//XCUIElementTypeCell/XCUIElementTypeOther//*[contains(@name, "Vacinas")]')
    }

    get iconChangeSearch() {
        return $('~btn_pharmacy_list')
    }

    get listStores() {
        return $('//XCUIElementTypeTable')
    }

    get firstStore() {
        return '//XCUIElementTypeTable/XCUIElementTypeCell[1]'
    }

    get storeName() {
        return $(`${this.firstStore}/XCUIElementTypeStaticText[1]`)
    }

    get storeAddress() {
        return $(`${this.firstStore}/XCUIElementTypeStaticText[2]`)
    }

    get storeDistance() {
        return $(`${this.firstStore}/XCUIElementTypeStaticText[5]`)
    }

    get btnRoute() {
        return `//XCUIElementTypeButton[contains(@name, "Traçar")]`
    }

    // ======== ACTIONS ========
    async viewScreenRedeCredenciada() {
        await this.inputSearch.waitForDisplayed({ timeout: 10000 })
        await this.pharmacy.waitForDisplayed({ timeout: 10000 })
        await this.manipulation.waitForDisplayed({ timeout: 10000 })
        await this.iconChangeSearch.waitForDisplayed({ timeout: 20000 })
    }

    async viewListStores() {
        const storeList = this.listStores
        const firstPharmacy = this.firstStore

        await this.increaseSearchRadius()

        await storeList.waitForDisplayed({ timeout: 10000 })
        await $(firstPharmacy).waitForDisplayed({ timeout: 10000 })

        const PharmacyName = await this.storeName.getValue()
        const PharmacyAddress = await this.storeAddress.getValue()
        const PharmacyDistance = await this.storeDistance.getValue()
        await $(`${this.firstStore}${this.btnRoute}`).waitForExist()

        console.log(`Nome farmácia: ${PharmacyName} | Endereço farmácia: ${PharmacyAddress} | Distância farmácia: ${PharmacyDistance}`)
    }

    async increaseSearchRadius() {
        const btnLetsGo = $('//XCUIElementTypeButton[@name="Vamos lá"]')
        if (await btnLetsGo.isExisting()) {
            await this.checkpointScreen('Hmmm... Não encontramos Manipulados próximos(as) do endereço buscado, mas você pode ampliar seu campo de busca em até 10 vezes.')
            await btnLetsGo.click()
        }
    }

    async traceRouteToPharmacy() {
        await this.waitAndClick($(`(${this.btnRoute})[1]`))

        const btnMapas = $('//XCUIElementTypeButton[@name="Mapas"]')
        try {
            await this.waitAndClick(btnMapas)
        } catch (e) { }

        const inputlocation = $('//XCUIElementTypeSearchField[@name="WaypointSearchField"]')
        try {
            await this.waitAndSetValue(inputlocation, 'Rua amazonas são caetano do sul')

            const firstPlaceTable = $('(//XCUIElementTypeCell[@name="PlaceSummaryTableViewCell"])[1]')
            await this.waitAndClick(firstPlaceTable)
        } catch (e) { }

        const routeTime = $('~IOSRoutePlanningOverviewViewController')
        try {
            await routeTime.waitForDisplayed()
        } catch (e) { }
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

}
export default new RedeCredenciadaIOS()