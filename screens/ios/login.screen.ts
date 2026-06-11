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

    get popUpBiometrics() {
        return $('~subtitleLabelIdentifier')
    }

    get btnNao() {
        return $('~Não')
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

    // ======== METHODS ========

    async login(cpf: string, senha: string) {
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.waitAndClick(this.btnAcessar)
        try { await this.refuseBiometrics()} catch(e) { }
    }

    async viewMessageError() {
        await this.checkpointScreen('Senha incorreta')
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