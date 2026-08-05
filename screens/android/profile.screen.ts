import { $, expect } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ProfileAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get perfilTab() {
        return $('//android.widget.TextView[@text="Perfil"]')
    }

    get logoutIcon() {
        return $('id:com.astl.vidalink.beta:id/logout')
    }

    get modalLogout() {
        return $('id:com.astl.vidalink.beta:id/clLogoutDialog')
    }

    get btnLogoutYES() {
        return $('id:com.astl.vidalink.beta:id/tvYes')
    }

    get optionsProfile(){
        return '//androidx.cardview.widget.CardView[@resource-id="com.astl.vidalink.beta:id/itemContainer"]'
    }

    get boxEmail(){
        return $('id:com.astl.vidalink.beta:id/email')
    }

    get boxPhone(){
        return $('id:com.astl.vidalink.beta:id/phone')
    }

    get messageMyData(){
        return $('id:com.astl.vidalink.beta:id/cardMessage')
    }

    get iconBackTollbar(){
        return $('id:com.astl.vidalink.beta:id/ivBackArrow')
    }

    get myPlans(){
        return `//androidx.recyclerview.widget.RecyclerView[@resource-id="com.astl.vidalink.beta:id/rvMyPlans"]`
    }

    get btnResetPassword(){
        return $('id:com.astl.vidalink.beta:id/resetPassword')
    }

    get containerWhatsapp(){
        return $('id:com.astl.vidalink.beta:id/whatsappContainer')
    }

    get containerTelephoneSP(){
        return $('id:com.astl.vidalink.beta:id/txtSaoPaulo')
    }

    get iconCopyNumber(){
        return $('id:com.astl.vidalink.beta:id/copyCapital')
    }

    get containerOtherRegions(){
        return $('id:com.astl.vidalink.beta:id/txtOtherRegions')
    }

    get iconCopyOtherRegions(){
        return $('id:com.astl.vidalink.beta:id/copyOtherRegions')
    }

    get containerEmail(){
        return $('id:com.astl.vidalink.beta:id/emailContainer')
    }

    get containerDelete(){
        return $('id:com.astl.vidalink.beta:id/container')
    }

    get containerTerms(){
        return $('id:com.astl.vidalink.beta:id/terms_item')
    }

    // ======== ACTIONS ========

    async confirmLogout() {
        const btnLogoutYES = this.btnLogoutYES
        await this.modalLogout.waitForDisplayed()
        await this.waitAndClick(btnLogoutYES)

        const btnEntrar = $('id=com.astl.vidalink.beta:id/btnHave')
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
        // const whatsapp = this.containerWhatsapp
        const numberTelephoneSP = this.containerTelephoneSP
        const copyNumberSP = this.iconCopyNumber
        const otherRegions = this.containerOtherRegions
        const copyOtherRegions = this.iconCopyOtherRegions
        const emailSuporte = this.containerEmail

        await this.selectOptionProfileByName('Fale conosco')
        // await whatsapp.waitForDisplayed()
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

    async logout() {
        const btnOK = $(`id:com.astl.vidalink.beta:id/btConfirmOption`)
        if (await btnOK.isDisplayed()) {
            await btnOK.click()
        }
        const logoutIcon = this.logoutIcon
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

export default new ProfileAndroid()