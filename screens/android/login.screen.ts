import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'

class LoginAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get btnEntrar() {
        return $('id=com.astl.vidalink.beta:id/btnHave')
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

        await this.checkpointScreen('Matricula do titular')
        await this.waitAndSetValue(inputMatricula, matricula)
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

export default new LoginAndroid()