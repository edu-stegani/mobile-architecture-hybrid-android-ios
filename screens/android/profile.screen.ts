import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ProfileAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get perfilTab(){
        return $('//android.widget.TextView[@text="Perfil"]')
    }

    get cardBeneficios() {
        return $(`id=com.astl.vidalink.beta:id/tvCardHolderName`)
    }

    get logoutIcon (){
        return $('id:com.astl.vidalink.beta:id/ivLogout')
    }

    get modalLogout(){
        return $('id:com.astl.vidalink.beta:id/clLogoutDialog')
    }

    get btnLogoutYES(){
        return $('id:com.astl.vidalink.beta:id/tvYes')
    }

    // ======== ACTIONS ========
    async checkPerfilIcon() {
        await this.perfilTab.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    async checkUserCard(fullName: string) {
        await this.cardBeneficios.waitForDisplayed({ timeout: 30000, interval: 2000 })

        const cardText = await this.cardBeneficios.getText()
        await expect(cardText).toContain(fullName)
    }

    async confirmLogout(){
        const btnLogoutYES = this.btnLogoutYES
        await this.modalLogout.waitForDisplayed()
        await this.waitAndClick(btnLogoutYES)

        const btnEntrar = $('id=com.astl.vidalink.beta:id/btnHave')
        await btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
    }

    // ======== METHODS ========
    async checkUsernameInCard(fullName: string) {
        await this.checkUserCard(fullName)
    }

    async logout(){
        const logoutIcon = this.logoutIcon
        const perfil = this.perfilTab
        await this.checkPerfilIcon()
        await this.waitAndClick(perfil)
        await this.waitAndClick(logoutIcon)
        await this.confirmLogout()
    }

}

export default new ProfileAndroid()