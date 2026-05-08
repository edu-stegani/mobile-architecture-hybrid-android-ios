import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'

class LoginIOS extends BaseScreen {

    // ====== SELECTORS ======

    get btnEntrar() {
        return $('~enterButtonIdentifier')
    }

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

    // ======== ACTIONS ========

    async tapEntrar() {
        await this.btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
        await this.btnEntrar.click()
    }

    async fillCpf(cpf: string) {
        await this.inputCpf.waitForDisplayed({ timeout: 20000 })
        await this.inputCpf.setValue(cpf)
        await this.hideKeyboard()
    }

    async fillSenha(senha: string) {
        await this.inputSenha.waitForDisplayed({ timeout: 20000 })
        await this.inputSenha.setValue(senha)
        await this.hideKeyboard()
    }

    async fillMatricula(matricula: string) {
        await this.inputMatricula.waitForDisplayed({ timeout: 20000 })
        await this.inputMatricula.setValue(matricula)
        await this.hideKeyboard() // Esconde o teclado antes de clicar em Acessar
        await this.waitAndClick(this.btnAcessar)
    }

    async fillDateOfBirth(dateOfBirth: string) {
        const inputDateBirth = this.inputDateBirth
        await this.waitAndSetValue(inputDateBirth, dateOfBirth)
        await this.hideKeyboard()
    }

    // ======== METHODS ========

    async login(cpf: string, senha: string) {
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.waitAndClick(this.btnAcessar)
    }

    async viewMessageError() {
        await this.checkpointScreen('Quase lá! Ajuste sua senha para prosseguir.')
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

    async informNewPassword(newPassword: string) {
        const btnOk = this.btnOk
        const iconLock = this.iconLock
        const inputNewPassword = this.inputNewPassword
        const inputConfirmPassword = this.inputConfirmPassword

        await this.checkpointScreen('Tenha uma senha segura')
        await this.waitAndClick(btnOk)

        await iconLock.waitForDisplayed({ timeout: 10000 })
        await this.waitAndSetValue(inputNewPassword, newPassword)
        await this.hideKeyboard()
        await this.waitAndSetValue(inputConfirmPassword, newPassword)
        await this.hideKeyboard()

        await this.waitAndClick(this.btnProximoIOS)
    }

    async passwordCantBeEqualPrevious() {
        await this.checkpointScreen('Atenção! A nova senha não pode ser igual a senha anterior.')
        await this.waitAndClick($('~primaryButtonIdentifier'))
    }

}

export default new LoginIOS()