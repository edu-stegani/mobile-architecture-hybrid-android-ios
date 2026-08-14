import { $ } from '@wdio/globals'
import { Key } from 'webdriverio';
import BaseScreen from '../shared/base.screen.js'

class ProdutosAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get produtosTab() {
        return $(`//android.widget.TextView[@text="Produtos"]`)
    }
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

    get priceMax() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvMaximumPrice"]`
    }

    get priceMin() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvFromPrice"]`
    }

    get pharmacyViewDetails() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/tvVizualizar"]`
    }

    get pharmacyNameRoute() {
        return $('id:com.astl.vidalink.beta:id/tvName')
    }

    get pharmacyAddressRoute() {
        return $('id:com.astl.vidalink.beta:id/tvAddress')
    }

    get modalProductNoSubsidy() {
        return $('id:com.astl.vidalink.beta:id/tvDialogDescription')
    }

    get iconDoubtProduct() {
        return `//android.widget.ImageView[@resource-id="com.astl.vidalink.beta:id/icDoubt"]`
    }

    get labelDiscountPaper() {
        return $('id:com.astl.vidalink.beta:id/tvPaper')
    }

    // ======== ACTIONS ========
    async viewTollbarBuscarMedicamentos() {
        const tollbarBuscarMedicamento = $(`${this.tollbar}//android.widget.TextView[@text="Buscar medicamentos"]`)
        await tollbarBuscarMedicamento.waitForDisplayed({ timeout: 10000 })
    }

    async selectFirstProduct() {
        const cardMedicine = `(${this.cardProduct})[1]`
        await $(cardMedicine).waitForDisplayed({ timeout: 60000 })
        await $(cardMedicine).click()
    }

    async checkDoubtProduct() {
        const doubtProduct = $(`(${this.iconDoubtProduct})[1]`)
        await doubtProduct.waitForDisplayed({ timeout: 60000 })
        await doubtProduct.click()
        await this.checkpointScreen('Características do medicamento')
        await this.scrollToElement(this.labelDiscountPaper)
    }

    async filterPharmacyByOption(option: string) {
        const filter = this.filterButton
        const options = this.optionsFilter
        const selectedOption = $(`//*[contains(@text, "${option}")]`)

        await filter.waitForDisplayed({ timeout: 30000, interval: 1000 })
        await filter.click()
        await options.waitForDisplayed()
        await this.waitAndClick(selectedOption)
    }

    // ======== METHODS ========
    async searchProduct(name: string) {
        await this.viewTollbarBuscarMedicamentos()

        const inputSearch = this.inputSearch
        await this.waitAndClick(inputSearch)
        await inputSearch.setValue(name)
        await browser.keys(Key.Enter);
        await driver.hideKeyboard();
    }

    async viewProductDetails(index: string, name: string) {
        const cardMedicine = `(${this.cardProduct})[${index}]`
        const nameMedicine = $(`${cardMedicine}//android.widget.TextView[contains(@text, "${name}")]`)
        const fullPrice = $(`${cardMedicine}${this.priceProduct}`)
        const discountMedicine = $(`${cardMedicine}${this.discountProduct}`)
        const discountedPrice = $(`${cardMedicine}${this.discountedPrice}`)

        await $(cardMedicine).waitForDisplayed({ timeout: 30000 })
        await nameMedicine.waitForDisplayed()
        await fullPrice.waitForDisplayed()
        await discountMedicine.waitForDisplayed()
        await discountedPrice.waitForDisplayed()
    }

    async selectProductAndFilterByOption(option: string) {
        const firstPharmacy = `(${this.cardPharmacy})[1]`
        const pharmacyDistance = $(`${firstPharmacy}${this.pharmacyDistance}`)
        const pharmacyName = $(`${firstPharmacy}${this.pharmacyName}`)
        const pharmacyPriceMax = $(`${firstPharmacy}${this.priceMax}`)
        const pharmacyPriceMin = $(`${firstPharmacy}${this.priceMin}`)
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await this.selectFirstProduct()
        await this.filterPharmacyByOption(option)

        await $(firstPharmacy).waitForDisplayed()
        await pharmacyName.waitForDisplayed()
        await pharmacyDistance.waitForDisplayed()
        await pharmacyPriceMax.waitForDisplayed()
        await pharmacyPriceMin.waitForDisplayed()
        await pharmacyViewDetails.waitForDisplayed()
    }

    async selectTheFirstPharmacy() {
        const firstPharmacy = `(${this.cardPharmacy})[1]`
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await this.selectFirstProduct()
        await $(firstPharmacy).waitForDisplayed({ timeout: 60000 })
        await pharmacyViewDetails.waitForDisplayed()
        await this.waitAndClick(pharmacyViewDetails)
    }

    async productNoSubsidy() {
        const noSubsidyText = $(`(${this.cardProduct})[1]//*[@text="Não subsidiado"]`)

        await noSubsidyText.waitForDisplayed()
        await this.selectFirstProduct()
        await this.modalProductNoSubsidy.waitForDisplayed({ timeout: 60000 })
        await this.confirmAlert()
    }

    async productDiscountInSheet() {
        const discountInSheet = $(`(${this.cardProduct})[1]//*[contains(@text, "Desconto em folha")]`)
        const subsidyProduct = $(`(${this.cardProduct})[1]//*[contains(@text, "Subsidiado")]`)

        await discountInSheet.waitForDisplayed({ timeout: 60000 })
        await subsidyProduct.waitForDisplayed()
        await this.selectFirstProduct()
        await this.checkDoubtProduct()
    }

}

export default new ProdutosAndroid()