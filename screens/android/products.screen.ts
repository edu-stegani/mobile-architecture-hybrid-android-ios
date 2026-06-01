import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class BuscarMedicamentoAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get inputSearch() {
        return $(`id:com.astl.vidalink.beta:id/etSearch`)
    }

    get cardProduct() {
        return `//android.widget.FrameLayout[@resource-id="com.astl.vidalink.beta:id/cvMedicine"]`
    }

    get priceProduct() {
        return `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvPrice"]`
    }

    get discountProduct() {
        return `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvDiscount"]`
    }

    get discountedPrice() {
        return `//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvDiscountedPrice"]`
    }

    get filterButton() {
        return $(`id:com.astl.vidalink.beta:id/textViewSortBy`)
    }

    get optionsFilter() {
        return $('id:com.astl.vidalink.beta:id/layoutBottomSheetSortBy')
    }

    get cardPharmacy() {
        return `//android.widget.FrameLayout[@resource-id="com.astl.vidalink.beta:id/clContentItem"]`
    }

    get pharmacyName() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvPharmacyName"]`
    }

    get pharmacyDistance() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvDistance"]`
    }

    get priceMax(){
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvMaximumPrice"]`
    }

    get priceMin(){
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvFromPrice"]`
    }

    get pharmacyViewDetails() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvVizualizar"]`
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
        await driver.execute('mobile: performEditorAction', { action: 'search' });
        try { await driver.hideKeyboard(); } catch (error) { }
    }

    async viewProductDetails(index: string, name: string) {
        const cardMedicine = `(${this.cardProduct})[${index}]`
        const nameMedicine = $(`${cardMedicine}//android.widget.TextView[contains(@text, "${name}")]`)
        const fullPrice = $(`${cardMedicine}${this.priceProduct}`)
        const discountMedicine = $(`${cardMedicine}${this.discountProduct}`)
        const discountedPrice = $(`${cardMedicine}${this.discountedPrice}`)
        
        await $(cardMedicine).waitForDisplayed({ timeout: 10000 })
        await nameMedicine.waitForDisplayed()
        await fullPrice.waitForDisplayed()
        await discountMedicine.waitForDisplayed()
        await discountedPrice.waitForDisplayed()
    }

    async selectProductAndFilterByOption(option: string) {
        const cardMedicine = `(${this.cardProduct})[1]`
        const filter = this.filterButton
        const options = this.optionsFilter
        
        const selectedOption = $(`//*[contains(@text, "${option}")]`)   //android.widget.TextView

        const firstPharmacy = `(${this.cardPharmacy})[1]`
        
        const pharmacyDistance = $(`${firstPharmacy}${this.pharmacyDistance}`)
        const pharmacyName = $(`${firstPharmacy}${this.pharmacyName}`)
        const pharmacyPriceMax = $(`${firstPharmacy}${this.priceMax}`)
        const pharmacyPriceMin = $(`${firstPharmacy}${this.priceMin}`)
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await this.waitAndClick($(cardMedicine))

        await this.waitAndClick(filter)
        await options.waitForDisplayed()
        await this.waitAndClick(selectedOption) 

        await $(firstPharmacy).waitForDisplayed()
        await pharmacyName.waitForDisplayed()
        await pharmacyDistance.waitForDisplayed()
        await pharmacyPriceMax.waitForDisplayed()
        await pharmacyPriceMin.waitForDisplayed()
        await pharmacyViewDetails.waitForDisplayed()
    }

}

export default new BuscarMedicamentoAndroid()