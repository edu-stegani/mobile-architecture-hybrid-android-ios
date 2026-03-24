import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ProfileIOS extends BaseScreen {

    // ====== SELECTORS ======
    get perfilTab(){
        return $('//XCUIElementTypeButton[@name="Perfil"]')
    }

    // get cardBeneficios() {
    //     return $(``)
    // }

    get logoutIcon (){
        return $('//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeButton')
    }

    get modalLogout(){
        return $('//XCUIElementTypeStaticText[@name="Deseja mesmo sair de seu usuário?"]')
    }

    get btnLogoutYES(){
        return $('~alert_right_button_identifier')
    }

    // ======== ACTIONS ========
    async checkPerfilIcon() {
        await this.perfilTab.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    // async checkUserCard(fullName: string) {
    //     await this.cardBeneficios.waitForDisplayed({ timeout: 30000, interval: 2000 })

    //     const cardText = await this.cardBeneficios.getText()
    //     await expect(cardText).toContain(fullName)
    // }

    async confirmLogout(){
        const btnLogoutYES = this.btnLogoutYES
        await this.modalLogout.waitForDisplayed()
        await this.waitAndClick(btnLogoutYES)

        const btnEntrar = $('~enterButtonIdentifier')
        await btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
    }

    // ======== METHODS ========
    // async checkUsernameInCard(fullName: string) {
    //     await this.checkUserCard(fullName)
    // }

    async logout(){
        const logoutIcon = this.logoutIcon
        const perfil = this.perfilTab
        await this.waitAndClick(perfil)
        await this.waitAndClick(logoutIcon)
        await this.confirmLogout()
    }

}

export default new ProfileIOS()