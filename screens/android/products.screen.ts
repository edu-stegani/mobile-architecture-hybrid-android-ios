import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ProdutosAndroid extends BaseScreen {

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

    get btnRoute() {
        return $('//android.widget.Button[@text="Traçar Rota"]')
    }

    get placeCard() {
        return `//*[@resource-id="com.google.android.apps.maps:id/business_place_card"]`
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

    async selectTheFirstPharmacy() {
        const medicineCard = $(`(${this.cardProduct})[1]`)
        const firstPharmacy = `(${this.cardPharmacy})[1]`
        const pharmacyViewDetails = $(`${firstPharmacy}${this.pharmacyViewDetails}`)

        await medicineCard.waitForDisplayed({ timeout: 30000 })
        await medicineCard.click()
        await $(firstPharmacy).waitForDisplayed()
        await pharmacyViewDetails.waitForDisplayed()
        await this.waitAndClick(pharmacyViewDetails)
    }

    async traceRouteToPharmacy() {
        const pharmacyName = this.pharmacyNameRoute
        const pharmacyAddress = this.pharmacyAddressRoute
        const btnRoute = this.btnRoute

        await pharmacyName.waitForDisplayed({ timeout: 10000 })
        await pharmacyAddress.waitForDisplayed({ timeout: 10000 })


        const addressPharmacy = await pharmacyAddress.getText()     // Pega o endereço completo da farmácia.
        const rawAddress = addressPharmacy.split('-')[0].trim();    // pega apenas a parte antes do hifen, endereço e numero.
        const addressWithComma = rawAddress.replace(/(\s)(\d+)/, ', $2');    // Coloca uma vírgula antes do número 

        // transformar em Title Case (Primeira Letra Maiúscula)
        const toTitleCase = (str: string) => {
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };
        const justAdress = toTitleCase(addressWithComma);
        
        await this.waitAndClick(btnRoute)

        await $(this.placeCard).waitForDisplayed({ timeout: 50000 })

        const namePLaceCard = `${this.placeCard}//*[contains(@text, "${justAdress}")]`
        await $(namePLaceCard).waitForDisplayed({ timeout: 10000 })
    }


}

export default new ProdutosAndroid()