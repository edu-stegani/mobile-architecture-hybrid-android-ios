import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

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

    // ======== ACTIONS ========
    async tapEntrar(){
        await this.btnEntrar.waitForDisplayed({ timeout: 60000, interval: 2000 })
        await this.btnEntrar.click()
    }

    async fillCpf(cpf: string) {
        await this.inputCpf.waitForDisplayed({ timeout: 15000 })
        await this.inputCpf.setValue(cpf)
        const iconCpfCheck = await $(`//android.widget.EditText[@resource-id='com.astl.vidalink.beta:id/etFirstField']/..//android.widget.ImageButton[@resource-id='com.astl.vidalink.beta:id/text_input_end_icon']`)
        await iconCpfCheck.waitForDisplayed({ timeout: 15000 })
    }

    async fillSenha(senha: string) {
        await this.inputSenha.waitForDisplayed({ timeout: 15000 })
        await this.inputSenha.setValue(senha)
        const iconPasswordCheck = await $(`//android.widget.EditText[@resource-id='com.astl.vidalink.beta:id/etSecondField']/..//android.widget.ImageButton[@resource-id='com.astl.vidalink.beta:id/text_input_end_icon']`)
        await iconPasswordCheck.waitForDisplayed({ timeout: 15000 })
    }

    async fillMatricula(matricula: string) {
        const labelMatricula = await $('//android.widget.TextView[contains(@text,"Matricula do titular")]')
        await labelMatricula.waitForDisplayed({ timeout: 30000 })
        await this.inputMatricula.waitForDisplayed({ timeout: 15000 })
        await this.inputMatricula.setValue(matricula)
        await this.waitAndClick(this.btnAcessar)
    }

    // ======== METHODS ========
    async login(cpf: string, senha: string) {
        await this.tapEntrar()
        await this.fillCpf(cpf)
        await this.fillSenha(senha)
        await this.waitAndClick(this.btnAcessar)
    }

    async viewMessageError(message: string){
        await this.checkpointScreen(message)
    }

}

export default new LoginAndroid()