import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class BenefitIOS extends BaseScreen {

    // ====== SELECTORS ======
    get titleBenefitMed() {
        return $('~Med') 
    }

    // ====== METHODS ======
    async checkBenefitScreen() {
        await this.titleBenefitMed.waitForDisplayed({ timeout: 5000, interval: 2000 }) 
    }

    async clickLinkByText(linkText: string) {
        await this.checkBenefitScreen()
        const linkSelector = `//XCUIElementTypeTable//XCUIElementTypeStaticText[@label="${linkText}"]` 
        await this.scrollToElement(linkSelector)
        await this.waitAndClick($(linkSelector))
    }

}

export default new BenefitIOS()