import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ProdutosIOS extends BaseScreen {

    // ====== SELECTORS ======
    get produtosTab(){
        return $(`//XCUIElementTypeButton[@name="Produtos"]`)
    }
    
    get inputSearch() {
        return $(`//XCUIElementTypeTextField[@value="Buscar..."]`)
    }

    get cardProduct() {
        return `//XCUIElementTypeTable/XCUIElementTypeCell`
    }

    get priceProduct() {
        return `/XCUIElementTypeStaticText[3]`
    }

    get discountProduct() {
        return `/XCUIElementTypeStaticText[6]`
    }

    get discountedPrice() {
        return `/XCUIElementTypeStaticText[5]`
    }

    get filterButton() {
        return $(`//XCUIElementTypeButton[contains(@name, "Ordenado por:")]`)
    }

    get optionsFilter() {
        return $('//XCUIElementTypeOther/XCUIElementTypeStaticText[@name="Ordenar por"]/../XCUIElementTypeTable')
    }

    get cardPharmacy() {
        return `//XCUIElementTypeTable/XCUIElementTypeCell`
    }

    get pharmacyName() {
        return `/XCUIElementTypeStaticText[1]`
    }

    get pharmacyDistance() {
        return `/XCUIElementTypeStaticText[contains(@name, "Distância:")]`
    }

    get priceMax() {
        return `/XCUIElementTypeStaticText[contains(@name, "Preço máximo:")]`
    }

    get priceMin() {
        return `/XCUIElementTypeStaticText[contains(@name, "A partir de:")]`
    }

    get pharmacyViewDetails() {
        return `/XCUIElementTypeStaticText[@name="Ver detalhes da farmácia"]`
    }

    get modalProductNoSubsidy() {
        return $('id:com.astl.vidalink.beta:id/tvDialogDescription')
    }

    get iconDoubtProduct() {
        return ``
    }

    get labelDiscountPaper(){
        return $('')
    }

    // ======== ACTIONS ========
    async viewTollbarBuscarMedicamentos() {
        await this.checkpointScreen('Buscar medicamentos')
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
        let filterText = option;
        if (option === 'Menor Preço') {
            filterText = 'Menor preço';
        }
        const selectedOption = $(`//XCUIElementTypeTable//XCUIElementTypeStaticText[@name="${filterText}"]`)

        await filter.waitForDisplayed({ timeout: 30000, interval: 1000 })
        await filter.click()
        await options.waitForDisplayed()
        await this.waitAndClick(selectedOption)
    }

    // ======== METHODS ========
    async searchProduct(name: string) {
        const inputSearch = this.inputSearch
        await this.waitAndClick(inputSearch)
        await inputSearch.setValue(name)

        const btnReturnTeclado = await $('~Return');
        if (await btnReturnTeclado.isExisting()) {
            await btnReturnTeclado.click();
        }
        try { await this.hideKeyboard() } catch (error) { }
    }

    async viewProductDetails(index: string, name: string) {
        const cardMedicine = `(${this.cardProduct})[${index}]`
        const nameMedicine = $(`${cardMedicine}/XCUIElementTypeStaticText[contains(@name, "${name}")]`)
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
        const firstPharmacy = `(${this.cardPharmacy})[1]`
        const pharmacyName = $(`${firstPharmacy}${this.pharmacyName}`)
        const pharmacyDistance = $(`${firstPharmacy}${this.pharmacyDistance}`)
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
        await $(firstPharmacy).waitForDisplayed({timeout: 60000})
        await pharmacyViewDetails.waitForDisplayed()
        await this.waitAndClick(pharmacyViewDetails)
    }

    async productNoSubsidy(){
        const noSubsidyText = $(`(${this.cardProduct})[1]//android.widget.TextView[@text="Não subsidiado"]`)

        await noSubsidyText.waitForDisplayed()
        await this.selectFirstProduct()
        await this.modalProductNoSubsidy.waitForDisplayed({ timeout: 60000 })
        await this.confirmAlert()
    }

    async productDiscountInSheet(){
        const discountInSheet = $(`(${this.cardProduct})[1]//*[contains(@text, "Desconto em folha")]`)
        const subsidyProduct = $(`(${this.cardProduct})[1]//*[contains(@text, "Subsidiado")]`)

        await discountInSheet.waitForDisplayed({ timeout: 60000 })
        await subsidyProduct.waitForDisplayed()
        await this.selectFirstProduct()
        await this.checkDoubtProduct()
    }

}

export default new ProdutosIOS()