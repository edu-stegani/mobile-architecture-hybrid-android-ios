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
        return $('')
    }

    get inputDateBirth() {
        return $('')
    }

    get btnLocateRegister() {
        return $('')
    }

    get inputCode() {
        return $('')
    }

    get btnConfirmRegister() {
        return $('')
    }

    get btnOk() {
        return $('')
    }

    get iconLock() {
        return $('')
    }

    get inputNewPassword() {
        return $('')
    }

    get inputConfirmPassword() {
        return $('')
    }

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

    async fillDateOfBirth(dateOfBirth: string) {
        const inputDateBirth = this.inputDateBirth
        await this.waitAndSetValue(inputDateBirth, dateOfBirth)
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

    async locateRegistration(cpf: string, dateOfBirth: string) {
        const btnLocateRegister = this.btnLocateRegister

        await this.checkpointScreen('Vamos localizar seu cadastro Vidalink')
        await this.fillCpf(cpf)
        await this.fillDateOfBirth(dateOfBirth)
        await this.waitAndClick(btnLocateRegister)
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

    async informNewPassword(newPassword: string) {
        const btnOk = this.btnOk
        const iconLock = this.iconLock
        const inputNewPassword = this.inputNewPassword
        const inputConfirmPassword = this.inputConfirmPassword

        await this.checkpointScreen('Tenha uma senha segura')
        await this.waitAndClick(btnOk)

        await iconLock.waitForDisplayed({ timeout: 10000 })
        await this.waitAndSetValue(inputNewPassword, newPassword)
        await this.waitAndSetValue(inputConfirmPassword, newPassword)

        await this.waitAndClick(this.btnAcessar)
        await this.checkpointScreen('SUCESSO')
    }

}

export default new LoginIOS()