import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class CardIOS extends BaseScreen {

    // ====== SELECTORS ======
    get cardTab() {
        return '//android.widget.TextView[@text="Cartão"]'
    }

    get card(){
        return '//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/clBackground"]'
    }

    get cardNumber(){
        return '//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvCardNumber"]'
    }

    get btnCopyNumberCard(){
        return '//android.widget.Button[@resource-id="com.astl.vidalink.beta:id/btnCopyNumber"]'
    }
    // ======== ACTIONS ========
    async viewCardAndName(name: string) {
        const cardName = `${this.card}//android.widget.TextView[contains(@text, "${name}")]`
        await expect($(cardName)).toBeDisplayed()

        const cardNumber = `${cardName}/..${this.cardNumber}`
        const number = await $(cardNumber).getText()
        return number
    }

    // ======== METHODS ========
    async navigationAndViewCards(name1: string, name2: string, name3: string) {
        const cardNumber1 = await this.viewCardAndName(name1)
        await this.SwipeLeftCoordinates(300)
        const cardNumber2 = await this.viewCardAndName(name2)
        await this.SwipeLeftCoordinates(300)
        const cardNumber3 = await this.viewCardAndName(name3)

        await this.SwipeRightCoordinates(300)
        await this.SwipeRightCoordinates(300)

        await this.waitAndClick($(this.cardTab))

        const numberCardScreen  = `${this.card}//android.widget.TextView[contains(@text, "${cardNumber1}")]`
        const numberCardScreen2 = `${this.card}//android.widget.TextView[contains(@text, "${cardNumber2}")]`
        const numberCardScreen3 = `${this.card}//android.widget.TextView[contains(@text, "${cardNumber3}")]`
        
        await expect($(numberCardScreen)).toBeDisplayed()
        await expect($(this.btnCopyNumberCard)).toBeEnabled()
        await this.SwipeLeftCoordinates(300)

        await expect($(numberCardScreen2)).toBeDisplayed()
        await this.SwipeLeftCoordinates(300)
        
        await expect($(numberCardScreen3)).toBeDisplayed()
    }

}

export default new CardIOS()