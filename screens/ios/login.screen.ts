import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class LoginIOS extends BaseScreen {

    // ====== SELECTORS ======

    get btnEntrar() {
        return $('//XCUIElementTypeButton[@name="enterButtonIdentifier"]')
    }

    get inputCpf() {
        return $('//XCUIElementTypeTextField[@name="cpfTextFieldTextFieldIdentifier"]')
    }

    get inputSenha() {
        return $('//XCUIElementTypeTextField[@name="passowrdTextFieldTextFieldIdentifier"]')
    }

    get inputMatricula() {
        return $('//XCUIElementTypeTextField[@name="enrollmentTextFieldTextFieldIdentifier"]')
    }

    get btnAcessar() {
        return $('//XCUIElementTypeButton[@name="signInEnterButtonIdentifier"]')
    }

    // ======== ACTIONS ========

    async tapEntrar() {
        await this.btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
        await this.btnEntrar.click()
    }

    async fillCpf(cpf: string) {
        await this.inputCpf.waitForDisplayed({ timeout: 15000 })
        await this.inputCpf.setValue(cpf)
    }

    async fillSenha(senha: string) {
        await this.inputSenha.waitForDisplayed({ timeout: 15000 })
        await this.inputSenha.setValue(senha)
    }

    async fillMatricula(matricula: string) {
        await this.inputMatricula.waitForDisplayed({ timeout: 15000 })
        await this.inputMatricula.setValue(matricula)
        await this.hideKeyboard() // Esconde o teclado antes de clicar em Acessar
        await this.waitAndClick(this.btnAcessar)
    }

    // ======== METHODS ========

    async login(cpf: string, senha: string) {
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.hideKeyboard() // Esconde o teclado antes de clicar em Acessar
        await this.waitAndClick(this.btnAcessar)
    }

}

export default new LoginIOS()