import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { faker } from '@faker-js/faker'

class LoginAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get btnEntrar() {
        return $('id=com.astl.vidalink.beta:id/btnHave')
    }

    get btnFirstAccess() {
        return $('id:com.astl.vidalink.beta:id/tvNewUserPassword')
    }

    get inputCpf() {
        return $('id=com.astl.vidalink.beta:id/etFirstField')
    }

    get inputSenha() {
        return $('id=com.astl.vidalink.beta:id/etSecondField')
    }

    get inputMatricula() {
        return $('id=com.astl.vidalink.beta:id/etFirstField')
    }

    get btnAcessar() {
        return $('id=com.astl.vidalink.beta:id/btnAccess')
    }

    get ForgotPasswordLink() {
        return $('id:com.astl.vidalink.beta:id/tvNewLoginForgotPassword')
    }

    get inputDateBirth() {
        return $('//android.widget.EditText[contains, (@text="dd/mm/aaaa")]')
    }

    get btnLocateRegister() {
        return $('id:com.astl.vidalink.beta:id/btnRegisterAccess')
    }

    get inputCode() {
        return $('id:com.astl.vidalink.beta:id/etCodeSms')
    }

    get btnConfirmRegister() {
        return $('id:com.astl.vidalink.beta:id/btnConfirmRegister')
    }

    get btnOk() {
        return $('id:com.astl.vidalink.beta:id/btAgree')
    }

    get iconLock() {
        return $('id:com.astl.vidalink.beta:id/lavLock')
    }

    get inputNewPassword() {
        return $('id:com.astl.vidalink.beta:id/etFirstField')
    }

    get inputConfirmPassword() {
        return $('id:com.astl.vidalink.beta:id/etSecondField')
    }

    get popUpBiometrics(){
        return $('id:com.astl.vidalink.beta:id/tvMessage')
    }

    get btnNao(){
        return $('id:com.astl.vidalink.beta:id/btDecline')
    }

    get checkboxKeepConnected(){
        return $('id:com.astl.vidalink.beta:id/cbNewLogin')
    }

    get checkboxAgreeTerm(){
        return $('id:com.astl.vidalink.beta:id/cbAgree')
    }

    get checkboxAgreeInfo(){
        return $('id:com.astl.vidalink.beta:id/cbAgreeInfo')
    }

    get btnAgreeTerms(){
        return $('id:com.astl.vidalink.beta:id/btAgreeTerms')
    }

    get btnNoAgreeTerms(){
        return '//android.widget.Button[@resource-id="com.astl.vidalink.beta:id/btCancel"]'
    }

    get inputEmailPrimeiroAcesso() {
        return $('//android.widget.EditText[@text="email@email.com.br"]')
    }

    get inputCellphonePrimeiroAcesso() {
        return $('//android.widget.EditText[@text="XX X XXXX-XXXX"]')
    }

    // ======== ACTIONS ========
    async tapEntrar() {
        await this.waitAndClick(this.btnEntrar)
    }

    async fillCpf(cpf: string) {
        const inputCpf = this.inputCpf
        await this.waitAndSetValue(inputCpf, cpf)
    }

    async fillSenha(senha: string) {
        const inputSenha = this.inputSenha
        await this.waitAndSetValue(inputSenha, senha)
    }

    async fillMatricula(matricula: string) {
        const inputMatricula = this.inputMatricula

        await this.checkpointScreen('Matrícula do titular')
        await this.waitAndSetValue(inputMatricula, matricula)
        await this.waitAndClick(this.btnAcessar)
    }

    async fillDateOfBirth(dateOfBirth: string) {
        const inputDateBirth = this.inputDateBirth
        await this.waitAndSetValue(inputDateBirth, dateOfBirth)
    }

    async refuseBiometrics(){
        const popUpBiometrics = this.popUpBiometrics
        const btnNao = this.btnNao

        await popUpBiometrics.waitForDisplayed({timeout: 10000, interval: 1000})
        await this.waitAndClick(btnNao)
    }

    // ======== METHODS ========
    async login(cpf: string, senha: string) {
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.waitAndClick(this.btnAcessar)
        try { await this.refuseBiometrics()} catch(e) { }
    }

    async loginKeepConnected(cpf: string, senha: string) {
        const checkboxManterConectado = this.checkboxKeepConnected
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.waitAndClick(checkboxManterConectado)
        await this.waitAndClick(this.btnAcessar)
        try { await this.refuseBiometrics()} catch(e) { }
    }

    async viewMessageError(message: string) {
        await this.checkpointScreen(message)
    }

    async clickForgotPassword() {
        const linkEsqueciSenha = this.ForgotPasswordLink
        await this.waitAndClick(linkEsqueciSenha)
    }

    async locateRegistration(cpf: string, dateOfBirth: string, matricula: string) {
        const btnLocateRegister = this.btnLocateRegister

        await this.tapEntrar()
        await this.clickForgotPassword()
        await this.checkpointScreen('Vamos localizar seu cadastro Vidalink')
        await this.fillCpf(cpf)
        await this.fillDateOfBirth(dateOfBirth)
        await this.waitAndClick(btnLocateRegister)
        await this.fillMatricula(matricula)
    }

    async informTokenSMS(socialId: string) {
        let smsToken = null;
        const inputCode = this.inputCode
        const iconCheck = $('id:com.astl.vidalink.beta:id/text_input_end_icon')
        const btnConfirmRegister = this.btnConfirmRegister

        await this.checkpointScreen('Enviamos um código de verificação para o celular')

        await browser.waitUntil(async () => {

            smsToken = await oracleHelpers.getLastSMS(socialId) // query para pegar o ultimo SMS recebido;
            return smsToken !== null && smsToken !== undefined;

        }, {
            timeout: 60000,
            timeoutMsg: 'ERRO: O SMS não recebido em 60 segundos',
            interval: 3000
        });
        console.log(`Sucesso! Token capturado: ${smsToken}`);

        await this.waitAndSetValue(inputCode, smsToken!.toString())
        await iconCheck.waitForDisplayed({ timeout: 10000 })

        await this.waitAndClick(btnConfirmRegister)
    }

    async informNewPassword(password?: string) {
        const btnOk = this.btnOk
        const iconLock = this.iconLock
        const inputNewPassword = this.inputNewPassword
        const inputConfirmPassword = this.inputConfirmPassword
        const newPassword = password ?? `${faker.string.alpha({ casing: 'upper' })}${faker.string.numeric(7)}`

        await this.checkpointScreen('Tenha uma senha segura')
        await this.waitAndClick(btnOk)

        await iconLock.waitForDisplayed({ timeout: 10000 })
        await this.waitAndSetValue(inputNewPassword, newPassword)
        await this.waitAndSetValue(inputConfirmPassword, newPassword)

        await this.waitAndClick(this.btnAcessar)
    }

    async firstAccess(cpf: string, birthdate: string, matricula: string) {
        await this.waitAndClick(this.btnFirstAccess)
        await this.fillCpf(cpf)
        await this.fillDateOfBirth(birthdate)
        await this.waitAndClick(this.btnLocateRegister)
        await this.fillMatricula(matricula)
    }

    async informEmailAndCellphone(email: string, cellphone: string) {
        await this.checkpointScreen('Agora vamos completar o seu cadastro')
        await this.waitAndSetValue(this.inputEmailPrimeiroAcesso, email)
        await driver.keys(['Tab']);
        await this.waitAndClick(this.inputCellphonePrimeiroAcesso)
        await this.waitAndSetValue(this.inputCellphonePrimeiroAcesso, cellphone)
        await driver.keys(['Tab']);
        // try { await browser.hideKeyboard() } catch (e) { } 
        await this.waitAndClick(this.btnLocateRegister)
    }

    async validatingData(cpf: string) {
        await this.checkpointScreen('Como gostaria de confirmar seu cadastro?')
        await this.waitAndClick($('id:com.astl.vidalink.beta:id/tvSmsValidation'))
        await this.informTokenSMS(cpf)
        await this.informNewPassword()
    }

    async passwordCantBeEqualPrevious() {
        await this.checkpointScreen('Atenção!')
        await this.checkpointScreen('A nova senha não pode ser igual a senha anterior.')
        await this.waitAndClick(this.btnConfirmPopUp)
    }

    async rejectTermsAndConditions() {
        const checkboxAgreeTerm = this.checkboxAgreeTerm
        const checkboxAgreeInfo = this.checkboxAgreeInfo
        const btnAceitar = this.btnAgreeTerms
        const btnNegar = this.btnNoAgreeTerms
        
        await this.scrollToElement(btnNegar)
        await checkboxAgreeTerm.waitForDisplayed({timeout: 15000, interval: 1000})
        await checkboxAgreeInfo.waitForDisplayed({timeout: 10000, interval: 1000})
        await btnAceitar.waitForDisplayed({timeout: 10000, interval: 1000})
        await this.waitAndClick($(btnNegar))
    
        await this.checkpointScreen('Ao não consentir com os termos e condições de uso, você não poderá prosseguir no aplicativo.\n\nTem certeza que deseja interromper o acesso ao app da Vidalink?')
        await this.btnConfirmPopUp.waitForDisplayed({timeout: 10000, interval: 1000})
        await this.waitAndClick(this.btnNao)
    }

    async agreeWithTermsAndConditions() {
        const checkboxAgreeTerm = this.checkboxAgreeTerm
        const checkboxAgreeInfo = this.checkboxAgreeInfo
        const btnAceitar = this.btnAgreeTerms
        const btnNegar = this.btnNoAgreeTerms

        await this.acceptFullAccessGalery()
        await this.acceptPermissionAlertLocation()

        await browser.pause(3000);
        await this.scrollToElement(btnNegar)
        await this.waitAndClick(checkboxAgreeTerm)
        await this.waitAndClick(checkboxAgreeInfo)
        await this.waitAndClick(btnAceitar)
    }

}

export default new LoginAndroid()