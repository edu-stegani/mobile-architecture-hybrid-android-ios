import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
<<<<<<< HEAD
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { faker } from '@faker-js/faker'
=======
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f

class LoginIOS extends BaseScreen {

    // ====== SELECTORS ======

    get btnEntrar() {
        return $('~enterButtonIdentifier')
    }

<<<<<<< HEAD
    get btnFirstAccess() {
        return $('~signupButtonIdentifier')
    }

=======
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
    get inputCpf() {
        return $('~cpfTextFieldTextFieldIdentifier')
    }

    get inputSenha() {
        return $('~passowrdTextFieldTextFieldIdentifier')
    }

    get inputMatricula() {
        return $('~enrollmentTextFieldTextFieldIdentifier')
    }

    get btnAcessar() {
        return $('~signInEnterButtonIdentifier')
    }

<<<<<<< HEAD
    get ForgotPasswordLink() {
        return $('~forgotPasswordLabelIdentifier')
    }

    get inputDateBirth() {
        return $('~birthDateTextFieldTextFieldIdentifier')
    }

    get btnLocateRegister() {
        return $('~findRegisterButtonIdentifier')
    }

    get inputCode() {
        return $('~codeTextFieldTextFieldIdentifier')
    }

    get btnConfirmRegister() {
        return $('~confirmButtonIdentifier')
    }

    get btnOk() {
        return $('~tipCardOkButtonIdentifier')
    }

    get iconLock() {
        return $('~animatedViewIdentifier')
    }

    get inputNewPassword() {
        return $('~passwordTextFieldTextFieldIdentifier')
    }

    get inputConfirmPassword() {
        return $('~passwordConfirmationTextFieldTextFieldIdentifier')
    }

    get popUpBiometrics() {
        return $('~subtitleLabelIdentifier')
    }

    get btnNao() {
        return $('~Não')
    }

    get checkboxKeepConnected() {
        return $('~keepMeConnectedButtonIdentifier')
    }

    get checkboxAgreeTerm() {
        return $('//XCUIElementTypeButton[@name="checkboxUnchecked"]')  
    }

    get checkboxAgreeInfo() {
        return $('//XCUIElementTypeButton[@name="reciveInfoCheckboxIdentifier"]')   //reciveInfoCheckboxIdentifier
    }

    get btnAgreeTerms() {
        return $('//XCUIElementTypeButton[@name="continueButtonIdentifier"]')   //~continueButtonIdentifier
    }

    get btnNoAgreeTerms() {
        return '//XCUIElementTypeButton[@name="needToThinkBetterButtonIdentifier"]'
    }

    get btnWantAccessApp(){
        return $('//XCUIElementTypeButton[@name="Quero acessar o app"]')
    }

    get btnNotAccessApp(){
        return $('//XCUIElementTypeButton[@name="Não acessar o app"]')
    }

    get inputEmailPrimeiroAcesso() {
        return $('~emailTextFieldTextFieldIdentifier')
    }

    get inputCellphonePrimeiroAcesso() {
        return $('~phoneTextFieldTextFieldIdentifier')
    }

    // ======== ACTIONS ========

    async tapEntrar() {
        await this.acceptNotifications()
        await this.waitAndClick(this.btnEntrar)
    }

    async fillCpf(cpf: string) {
        await this.waitAndSetValue(this.inputCpf, cpf)
        await this.hideKeyboard()
    }

    async fillSenha(senha: string) {
        await this.waitAndSetValue(this.inputSenha, senha)
        await this.hideKeyboard()
    }

    async fillMatricula(matricula: string) {
        await this.waitAndSetValue(this.inputMatricula, matricula)
        await this.hideKeyboard()
        await this.waitAndClick(this.btnAcessar)
    }

    async fillDateOfBirth(dateOfBirth: string) {
        const inputDateBirth = this.inputDateBirth
        await this.waitAndSetValue(inputDateBirth, dateOfBirth)
        await this.hideKeyboard()
    }

    async refuseBiometrics() {
        const popUpBiometrics = this.popUpBiometrics
        const btnNao = this.btnNao

        await popUpBiometrics.waitForDisplayed({ timeout: 10000, interval: 1000 })
        await this.waitAndClick(btnNao)
    }

=======
    // ======== ACTIONS ========

    async tapEntrar() {
        await this.btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
        await this.btnEntrar.click()
    }

    async fillCpf(cpf: string) {
        await this.inputCpf.waitForDisplayed({ timeout: 20000 })
        await this.inputCpf.setValue(cpf)
    }

    async fillSenha(senha: string) {
        await this.inputSenha.waitForDisplayed({ timeout: 20000 })
        await this.inputSenha.setValue(senha)
    }

    async fillMatricula(matricula: string) {
        await this.inputMatricula.waitForDisplayed({ timeout: 20000 })
        await this.inputMatricula.setValue(matricula)
        await this.hideKeyboard() // Esconde o teclado antes de clicar em Acessar
        await this.waitAndClick(this.btnAcessar)
    }

>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
    // ======== METHODS ========

    async login(cpf: string, senha: string) {
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
<<<<<<< HEAD
        await this.waitAndClick(this.btnAcessar)
        try { await this.refuseBiometrics() } catch (e) { }
    }

    async loginKeepConnected(cpf: string, senha: string) {
        const checkboxManterConectado = this.checkboxKeepConnected
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.waitAndClick(checkboxManterConectado)
        await this.waitAndClick(this.btnAcessar)
        try { await this.refuseBiometrics() } catch (e) { }
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
        await this.hideKeyboard()
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
        await this.hideKeyboard()
        await this.waitAndSetValue(inputConfirmPassword, newPassword)
        await this.hideKeyboard()

        await this.waitAndClick(this.btnProximoIOS)
    }

    async firstAccess(cpf: string, birthdate: string, matricula: string) {
        await this.acceptNotifications()
        await this.waitAndClick(this.btnFirstAccess)
        await this.fillCpf(cpf)
        await this.fillDateOfBirth(birthdate)
        await this.waitAndClick(this.btnAgreeTerms)
        await this.fillMatricula(matricula)
    }

    async informEmailAndCellphone(email: string, cellphone: string) {
        await this.checkpointScreen('Agora vamos completar o seu cadastro')
        await this.waitAndSetValue(this.inputEmailPrimeiroAcesso, email)
        await this.hideKeyboard()
        await this.waitAndClick(this.inputCellphonePrimeiroAcesso)
        await this.waitAndSetValue(this.inputCellphonePrimeiroAcesso, cellphone)
        await this.hideKeyboard()
        await this.waitAndClick(this.btnAgreeTerms)
    }

    async validatingData(cpf: string) {
        await this.checkpointScreen('Como gostaria de confirmar seu cadastro?')
        await this.waitAndClick($('//XCUIElementTypeStaticText[@name="Validando por SMS"]'))
        await this.informTokenSMS(cpf)
        await this.informNewPassword()
    }

    async passwordCantBeEqualPrevious() {
        await this.checkpointScreen('Atenção! A nova senha não pode ser igual a senha anterior.')
        await this.waitAndClick(this.btnPrimary)
    }

    async rejectTermsAndConditions() {
        const checkboxAgreeTerm = this.checkboxAgreeTerm
        const checkboxAgreeInfo = this.checkboxAgreeInfo
        const btnAceitar = this.btnAgreeTerms
        const btnNegar = this.btnNoAgreeTerms

        await this.acceptFullAccessGalery()
        await this.acceptPermissionAlertLocation()

        await browser.pause(3000);
        await this.scrollToElement(btnNegar)
        await checkboxAgreeTerm.waitForDisplayed({ timeout: 15000, interval: 1000 })
        await checkboxAgreeInfo.waitForDisplayed({ timeout: 10000, interval: 1000 })
        await btnAceitar.waitForDisplayed({ timeout: 10000, interval: 1000 })
        await this.waitAndClick($(btnNegar))

        await this.checkpointScreen('Ao não consentir com os termos e condições de uso, você não poderá prosseguir no aplicativo.')
        await this.btnWantAccessApp.waitForDisplayed({ timeout: 10000, interval: 1000 })
        await this.waitAndClick(this.btnNotAccessApp)
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
=======
        await this.hideKeyboard() // Esconde o teclado antes de clicar em Acessar
        await this.waitAndClick(this.btnAcessar)
    }

    async viewMessageError(){
        await this.checkpointScreen('Quase lá! Ajuste sua senha para prosseguir.')
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
    }

}

export default new LoginIOS()