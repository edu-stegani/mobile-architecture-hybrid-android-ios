import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class BenefitAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get titleBenefitMed() {
        return $('//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/toolbar"]//android.widget.TextView[@text="Med"]')
    }

    // ====== METHODS ======
    async checkBenefitScreen() {
        await this.titleBenefitMed.waitForDisplayed({ timeout: 5000, interval: 2000 }) 
    }

    async clickLinkByText(linkText: string) {
        await this.checkBenefitScreen()
        const linkSelector = `//androidx.recyclerview.widget.RecyclerView[@resource-id="com.astl.vidalink.beta:id/rvLinks"]//android.widget.TextView[@text="${linkText}"]`
        await this.scrollToElement(linkSelector)
        await this.waitAndClick($(linkSelector))
    }

}

export default new BenefitAndroid()