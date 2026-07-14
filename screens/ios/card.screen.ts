import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
import { AppHelper } from '../../support/utils/appHelper.js'

class CardIOS extends BaseScreen {

    // ====== SELECTORS ======
    get cardTab() {
        return '//XCUIElementTypeButton[@name="Cartão"]'
    }

    get card() {
        return '//XCUIElementTypeCell'
    }

    get cardNumber() {
        return '//XCUIElementTypeStaticText[@name="lblNumber"]'
    }

    get btnCopyNumberCard() {
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

    async captureCardsNumbersOnHome(name1: string, name2: string, name3: string) {
        const cardNumber1 = await this.viewCardAndName(name1) as string;

        await this.SwipeLeftCoordinates(210);
        const cardNumber2 = await this.viewCardAndName(name2) as string;

        await this.SwipeLeftCoordinates(210);
        const cardNumber3 = await this.viewCardAndName(name3) as string;

        await this.SwipeRightCoordinates(210);
        await this.SwipeRightCoordinates(210);

        return { cardNumber1, cardNumber2, cardNumber3 };
    }

    async validateCardsOnCardScreen(cardNumbers: { cardNumber1: string, cardNumber2: string, cardNumber3: string }) {
        const { cardNumber1, cardNumber2, cardNumber3 } = cardNumbers;
        const numberCardScreen1 = `${this.card}//*[contains(@name, "${cardNumber1}")]`;
        const numberCardScreen2 = `${this.card}//*[contains(@name, "${cardNumber2}")]`;
        const numberCardScreen3 = `${this.card}//*[contains(@name, "${cardNumber3}")]`;

        await this.waitAndClick($(this.cardTab));

        await expect($(numberCardScreen1)).toBeDisplayed();
        await expect($(this.btnCopyNumberCard)).toBeEnabled();
        await this.SwipeLeftCoordinates(350);

        await expect($(numberCardScreen2)).toBeDisplayed();
        await this.SwipeLeftCoordinates(350);

        await expect($(numberCardScreen3)).toBeDisplayed();
    }

    // ======== METHODS ========
    async validateInfoCardsOnHomeAndCardScreen(name1: string, name2: string, name3: string) {
        const cardnumbers = await this.captureCardsNumbersOnHome(name1, name2, name3)
        await this.validateCardsOnCardScreen(cardnumbers)
    }

    async validateCardsAfterClose(name1: string, name2: string, name3: string) {
        const cardnumbers = await this.captureCardsNumbersOnHome(name1, name2, name3)
        await AppHelper.resetApp()
        await this.validateCardsOnCardScreen(cardnumbers)
    }

    async validateCardsMultiplePlans(name: string, ct1: string, ct2: string) {
        const cardName = `${this.card}/*[contains(@label, "${name}")]`
        await expect($(cardName)).toBeDisplayed()

        const cardPlan1 = `${cardName}/..//*[contains(@label, "${ct1}")]`
        await expect($(cardPlan1)).toBeDisplayed()

        const cardPlan2 = `${cardName}/..//*[contains(@label, "${ct2}")]`
        const maxSwipes = 5
        for (let swipe = 0; swipe < maxSwipes; swipe++) {
            const cardPlan2Element = await $(cardPlan2)
            if (await cardPlan2Element.isDisplayed()) {
                break
            }
            await this.SwipeLeftCoordinates(220)
        }

        await expect($(cardPlan2)).toBeDisplayed()
    }

}

export default new CardIOS()