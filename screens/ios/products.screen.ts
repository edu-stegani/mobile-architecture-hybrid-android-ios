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

    // ======== ACTIONS ========
    async viewTollbarBuscarMedicamentos() {
        await this.checkpointScreen('Buscar medicamentos')
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
        const cardMedicine = `(${this.cardProduct})[1]`
        const filter = this.filterButton
        const options = this.optionsFilter

        let filterText = option;
        if (driver.isIOS && option === 'Menor Preço') {
            filterText = 'Menor preço';
        }

        const selectedOption = $(`//XCUIElementTypeTable//XCUIElementTypeStaticText[@name="${filterText}"]`)

        const firstPharmacy = `(${this.cardPharmacy})[1]`
        const pharmacyName = $(`${firstPharmacy}${this.pharmacyName}`)
        const pharmacyDistance = $(`${firstPharmacy}${this.pharmacyDistance}`)
        const pharmacyPriceMax = $(`${firstPharmacy}${this.priceMax}`)
        const pharmacyPriceMin = $(`${firstPharmacy}${this.priceMin}`)
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await $(cardMedicine).waitForDisplayed({ timeout: 60000 })
        await $(cardMedicine).click()

        await filter.waitForDisplayed({timeout:30000, interval:1000})
        await filter.click()
        await options.waitForDisplayed()
        await this.waitAndClick(selectedOption)

        await $(firstPharmacy).waitForDisplayed()
        await pharmacyName.waitForDisplayed()
        await pharmacyDistance.waitForDisplayed()
        await pharmacyPriceMax.waitForDisplayed()
        await pharmacyPriceMin.waitForDisplayed()
        await pharmacyViewDetails.waitForDisplayed()
    }

    async selectTheFirstPharmacy() {
        const medicineCard = $(`(${this.cardProduct})[1]`)
        const firstPharmacy = `(${this.cardPharmacy})[1]`
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await medicineCard.waitForDisplayed({ timeout: 60000 })
        await medicineCard.click()
        await $(firstPharmacy).waitForDisplayed({timeout: 60000})
        await pharmacyViewDetails.waitForDisplayed()
        await this.waitAndClick(pharmacyViewDetails)
    }

    async productNoSubsidy(){
        const cardMedicine = `(${this.cardProduct})[1]`
        const noSubsidyText = $(`${cardMedicine}//android.widget.TextView[@text="Não subsidiado"]`)

        await $(cardMedicine).waitForDisplayed({ timeout: 60000 })
        await noSubsidyText.waitForDisplayed()

        await $(cardMedicine).click()
        await this.modalProductNoSubsidy.waitForDisplayed({ timeout: 60000 })
        await this.confirmAlert()
    }

}

export default new ProdutosIOS()