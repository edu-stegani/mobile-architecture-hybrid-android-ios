import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class CardIOS extends BaseScreen {

    // ====== SELECTORS ======
    get cardTab() {
        return '//XCUIElementTypeButton[@name="Cartão"]'
    }

    get card(){
        return '//XCUIElementTypeCell'
    }

    get cardNumber(){
        return '//XCUIElementTypeStaticText[@name="lblNumber"]'
    }

    get btnCopyNumberCard(){
        return '(//XCUIElementTypeButton[@name="Copiar número do cartão"])[1]'
    }
    // ======== ACTIONS ========
    async viewCardAndName(name: string) {
        const cardName = `${this.card}//*[contains(@name, "${name}")]`
        await expect($(cardName)).toBeDisplayed()

        const cardNumber = `${cardName}/..${this.cardNumber}`
        const number = await $(cardNumber).getValue()
        return number
    }

    // ======== METHODS ========
    async navigationAndViewCards(name1: string, name2: string, name3: string) {
        const cardNumber1 = await this.viewCardAndName(name1)
        await this.SwipeLeftCoordinates(220)
        const cardNumber2 = await this.viewCardAndName(name2)
        await this.SwipeLeftCoordinates(220)
        const cardNumber3 = await this.viewCardAndName(name3)

        await this.SwipeRightCoordinates(220)
        await this.SwipeRightCoordinates(220)

        await this.waitAndClick($(this.cardTab))

        const numberCardScreen  = `${this.card}//*[contains(@value, "${cardNumber1}")]`
        const numberCardScreen2 = `${this.card}//*[contains(@value, "${cardNumber2}")]`
        const numberCardScreen3 = `${this.card}//*[contains(@value, "${cardNumber3}")]`
        
        await expect($(numberCardScreen)).toBeDisplayed()
        await expect($(this.btnCopyNumberCard)).toBeEnabled()
        await this.SwipeLeftCoordinates(300)

        await expect($(numberCardScreen2)).toBeDisplayed()
        await this.SwipeLeftCoordinates(300)
        
        await expect($(numberCardScreen3)).toBeDisplayed()
    }

}

export default new CardIOS()