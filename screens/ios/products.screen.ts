import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class BuscarMedicamentoIOS extends BaseScreen {

    // ====== SELECTORS ======
    get inputSearch() {
        return $(``)
    }

    get cardProduct() {
        return ``
    }

    get priceProduct() {
        return ``
    }

    get discountProduct() {
        return ``
    }

    get discountedPrice() {
        return ``
    }

    get filterButton() {
        return $(``)
    }

    get optionsFilter() {
        return $('')
    }

    get cardPharmacy() {
        return ``
    }

    get pharmacyName() {
        return ``
    }

    get pharmacyDistance() {
        return ``
    }

    get priceMax(){
        return ``
    }

    get priceMin(){
        return ``
    }

    get pharmacyViewDetails() {
        return ``
    }

    // ======== ACTIONS ========
    async viewTollbarBuscarMedicamentos() {
        const tollbarBuscarMedicamento = $(`${this.tollbar}//android.widget.TextView[@text="Buscar medicamentos"]`)
        await tollbarBuscarMedicamento.waitForDisplayed({ timeout: 10000 })
    }

    // ======== METHODS ========
    async searchProduct(name: string) {
        await this.viewTollbarBuscarMedicamentos()

        const inputSearch = this.inputSearch
        await this.waitAndClick(inputSearch)
        await inputSearch.setValue(name)
        await driver.execute('mobile: pressKey', { keycode: 66 });
        try { await driver.hideKeyboard(); } catch (error) { }
    }

    async viewProductDetails(index: string, name: string) {
        const cardMedicine = `(${this.cardProduct})[${index}]`
        const nameMedicine = $(`${cardMedicine}//android.widget.TextView[contains(@text, "${name}")]`)
        const fullPrice = $(`${cardMedicine}${this.priceProduct}`)
        const discountMedicine = $(`${cardMedicine}${this.discountProduct}`)
        const discountedPrice = $(`${cardMedicine}${this.discountedPrice}`)
        
        await $(cardMedicine).waitForDisplayed()
        await nameMedicine.waitForDisplayed()
        await fullPrice.waitForDisplayed()
        await discountMedicine.waitForDisplayed()
        await discountedPrice.waitForDisplayed()
    }

    async selectProductAndFilterByOption(option: string) {
        const cardMedicine = `(${this.cardProduct})[1]`
        const filter = this.filterButton
        const options = this.optionsFilter
        
        const selectedOption = $(`//*[contains(@text, "${option}")]`)  

        const firstPharmacy = $(`(${this.cardPharmacy})[1]`)
        const pharmacyName = $(`${firstPharmacy}${this.pharmacyName}`)
        const pharmacyDistance = $(`${firstPharmacy}${this.pharmacyDistance}`)
        const pharmacyPriceMax = $(`${firstPharmacy}${this.priceMax}`)
        const pharmacyPriceMin = $(`${firstPharmacy}${this.priceMin}`)
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await this.waitAndClick($(cardMedicine))

        await this.waitAndClick(filter)
        await options.waitForDisplayed()
        await this.waitAndClick(selectedOption)

        await firstPharmacy.waitForDisplayed()
        await pharmacyName.waitForDisplayed()
        await pharmacyDistance.waitForDisplayed()
        await pharmacyPriceMax.waitForDisplayed()
        await pharmacyPriceMin.waitForDisplayed()
        await pharmacyViewDetails.waitForDisplayed()
    }

}

export default new BuscarMedicamentoIOS()