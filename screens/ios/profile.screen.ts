import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ProfileIOS extends BaseScreen {

    // ====== SELECTORS ======
    get perfilTab(){
        return $('//XCUIElementTypeButton[@name="Perfil"]')
    }

    get logoutIcon (){
        return $('//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeButton')
    }

    get modalLogout(){
        return $('//XCUIElementTypeStaticText[@name="Deseja mesmo sair de seu usuário?"]')
    }

    get btnLogoutYES(){
        return $('~alert_right_button_identifier')
    }

    get optionsProfile(){
        return ''
    }

    get boxEmail(){
        return $('')
    }

    get boxPhone(){
        return $('')
    }

    get messageMyData(){
        return $('')
    }

    get iconBackTollbar(){
        return $('')
    }

    get myPlans(){
        return ``
    }

    get btnResetPassword(){
        return $('')
    }

    get containerWhatsapp(){
        return $('')
    }

    get containerTelephoneSP(){
        return $('')
    }

    get iconCopyNumber(){
        return $('')
    }

    get containerOtherRegions(){
        return $('')
    }

    get iconCopyOtherRegions(){
        return $('')
    }

    get containerEmail(){
        return $('')
    }

    get containerDelete(){
        return $('')
    }

    get containerTerms(){
        return $('')
    }

    // ======== ACTIONS ========

    async confirmLogout(){
        const btnLogoutYES = this.btnLogoutYES
        await this.modalLogout.waitForDisplayed()
        await this.waitAndClick(btnLogoutYES)

        const btnEntrar = $('~enterButtonIdentifier')
        await btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
    }

    async selectOptionProfileByName(name: string) {
        const optionProfile = `${this.optionsProfile}//*[contains(@text, "${name}")]`
        const titleTollbarOption = `${this.tollbar}/../*[contains(@text, "${name}")]`

        await this.waitAndClick($(optionProfile))
        await $(titleTollbarOption).waitForDisplayed({ interval: 1000 })
    }

    async validateMyData(){
        const boxEmail = this.boxEmail
        const boxPhone = this.boxPhone
        const message = this.messageMyData

        await this.selectOptionProfileByName('Meus dados')
        await boxEmail.waitForDisplayed({interval:1000})
        await boxPhone.waitForDisplayed({interval:1000})
        await message.waitForDisplayed({interval:1000})
        await this.iconBackTollbar.click()
    }

    async validateMyPlan(myPlan: string){
        const plan = `${this.myPlans}//*[contains(@text, "${myPlan}")]`

        await this.selectOptionProfileByName('Meus Planos')
        await $(plan).waitForDisplayed({interval:1000})
        await this.iconBackTollbar.click()
    }

    async validateSecurity(){
        const btnAlterarSenha = this.btnResetPassword

        await this.selectOptionProfileByName('Segurança')
        await btnAlterarSenha.waitForDisplayed({interval:1000})
        await this.iconBackTollbar.click()
    }

    async validateTalkToUs(){
        const whatsapp = this.containerWhatsapp
        const numberTelephoneSP = this.containerTelephoneSP
        const copyNumberSP = this.iconCopyNumber
        const otherRegions = this.containerOtherRegions
        const copyOtherRegions = this.iconCopyOtherRegions
        const emailSuporte = this.containerEmail

        await this.selectOptionProfileByName('Fale conosco')
        await whatsapp.waitForDisplayed()
        await numberTelephoneSP.waitForDisplayed()
        await this.waitAndClick(copyNumberSP)
        await otherRegions.waitForDisplayed()
        await this.waitAndClick(copyOtherRegions)
        await emailSuporte.waitForDisplayed()
        await this.iconBackTollbar.click()
    }

    async validateManageApp(){
        const excluirCadastro = this.containerDelete
        const termosUso = this.containerTerms

        await this.selectOptionProfileByName('Gerenciar app')
        await excluirCadastro.waitForDisplayed()
        await termosUso.waitForDisplayed()
    }

    // ======== METHODS ========

    async logout(){
        const logoutIcon = this.logoutIcon
        const perfil = this.perfilTab
        await this.waitAndClick(perfil)
        await this.waitAndClick(logoutIcon)
        await this.confirmLogout()
    }

    async navigateMenuProfile(userPlan: string){
        const iconePerfil = this.perfilTab
        
        await this.waitAndClick(iconePerfil)
        await this.validateMyData()
        await this.validateMyPlan(userPlan)
        await this.validateSecurity()
        await this.validateTalkToUs()
        await this.validateManageApp()
    }

}

export default new ProfileIOS()