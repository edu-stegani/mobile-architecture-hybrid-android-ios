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
        return '//XCUIElementTypeCollectionView'
    }

    get boxEmail(){
        return $('~Opção E-mail')
    }

    get boxPhone(){
        return $('~Opção Número de telefone')
    }

    get messageMyData(){
        return $('//XCUIElementTypeCell[@name="Opção "]')
    }

    get btnResetPassword(){
        return $('//XCUIElementTypeCell[@name="Opção Alterar senha de acesso"]')
    }

    get containerWhatsapp(){
        return $('~whatsApp')
    }

    get containerTelephoneSP(){
        return $('~phone_number')
    }

    get iconCopyNumber(){
        return $('(//XCUIElementTypeImage[@name="copy_fill"])[1]')
    }

    get containerOtherRegions(){
        return $('~Opção Demais regiões')
    }

    get iconCopyOtherRegions(){
        return $('(//XCUIElementTypeImage[@name="copy_fill"])[2]')
    }

    get containerEmail(){
        return $('~email_profile')
    }

    get containerDelete(){
        return $('~pr-logout')
    }

    get containerTerms(){
        return $('~term-use-profile')
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
        const optionProfile = `${this.optionsProfile}//XCUIElementTypeCell[contains(@name, "${name}")]`
        const titleTollbarOption = `//XCUIElementTypeOther[@name="Titulo da tela ${name}"]`

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
        await this.back()
    }

    async validateMyPlan(myPlan: string){
        const plan = `//*[contains(@name, "${myPlan}")]`

        const meusPlanos = process.env.PLATFORM === 'ios'
            ? `Meus planos`
            : `Meus Planos`;
        await this.selectOptionProfileByName(`${meusPlanos}`)
        await $(plan).waitForDisplayed({interval:2000})
        await this.back()
    }

    async validateSecurity(){
        const btnAlterarSenha = this.btnResetPassword

        await this.selectOptionProfileByName('Segurança')
        await btnAlterarSenha.waitForDisplayed({interval:1000})
        await this.back()
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
        await this.back()
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