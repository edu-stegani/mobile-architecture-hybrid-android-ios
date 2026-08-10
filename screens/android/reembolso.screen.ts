import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'
import { log } from 'console'

class ReembolsoAndroid extends BaseScreen {

    // ====== SELECTORS ======
    get btnRequestRefund() {
        return $('id:com.astl.vidalink.beta:id/btRequestRefund')
    }

    get inputMedicineName() {
        return $('id:com.astl.vidalink.beta:id/etMedicineName')
    }

    get btnConfirmRefund() {
        return $('android=new UiSelector().resourceId("com.astl.vidalink.beta:id/btnNextRefundRequest").text("Confirmar")')
    }

    get btnSendInvoice() {
        return $('//android.widget.Button[@content-desc="cupomfiscal"]')    //new UiSelector().resourceId("com.astl.vidalink.beta:id/btnNextFile")  android=new UiSelector().resourceId("com.astl.vidalink.beta:id/btnNextFile").text("Enviar Nota Fiscal")
    }

    get btnSendRecipe() {
        return $('//android.widget.Button[@content-desc="receitamedica"]')    //android=new UiSelector().resourceId("com.astl.vidalink.beta:id/btnNextFile").text("Enviar receita")
    }

    get labelSuccess() {
        return $(`//*[@resource-id="com.astl.vidalink.beta:id/tvLabel"][@text="SUCESSO"]`)
    }

    get labelDataSended() {
        return $('//*[@resource-id="com.astl.vidalink.beta:id/tvMessage"][@text="Dados enviados."]')
    }

    get btnFinish() {
        return $('id:com.astl.vidalink.beta:id/btFinish')
    }

    get cardRefund() {
        return `//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/clRefundItem"]`
    }

    get selectBank() {
        return $('//android.widget.AutoCompleteTextView[@resource-id="com.astl.vidalink.beta:id/etBank"]/..//android.widget.ImageButton')
    }

    get optionBank() {
        return `//*[@resource-id="com.astl.vidalink.beta:id/rvBank"]`
    }

    get inputAgency() {
        return $('id:com.astl.vidalink.beta:id/etAgencyNumber')
    }

    get inputAccount() {
        return $('id:com.astl.vidalink.beta:id/etAccountNumber')
    }

    get inputDigit() {
        return $('id:com.astl.vidalink.beta:id/etAccountDigit')
    }

    get btnConfirmDataBank() {
        return $(`//android.widget.Button[@resource-id="com.astl.vidalink.beta:id/btnNextFile"]`)
    }

    get refundStatus() {
        return `(${this.cardRefund})[1]//*[@resource-id="com.astl.vidalink.beta:id/tvMedicineRefundStatus"]`
    }

    // ======== ACTIONS ========
    async viewTollbarReembolso() {
        const tollbarReembolso = $(`${this.tollbar}//android.widget.TextView[@text="Reembolso"]`)
        await tollbarReembolso.waitForDisplayed({ timeout: 10000 })
    }

    async fillAndSelectMedicineName(medicineName: string) {
        const inputNomeMedicamento = this.inputMedicineName
        const filteredOption = $(`//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvMedicineName" and @text="${medicineName}"]`)
        const iconeDelete = this.btnDeleteAndroid

        await this.checkpointScreen('Informe os nomes dos medicamentos para solicitar o reembolso')
        await this.waitAndSetValue(inputNomeMedicamento, medicineName)

        await this.waitAndClick(filteredOption)
        await iconeDelete.waitForDisplayed();

        try { await driver.hideKeyboard(); } catch (error) { }
        await this.waitAndClick(this.btnConfirmRefund)
    }

    async whoIsTheRefundFor(userName: string) {
        const btnRadioUser = $(`//android.widget.TextView[contains(@text,"${userName}")]`)

        await this.checkpointScreen('Para quem é o reembolso?')
        await this.waitAndClick(btnRadioUser)

        try { await driver.hideKeyboard(); } catch (error) { }
        await this.waitAndClick(this.btnConfirmRefund)
    }

    async whatIsReasonRefund(reason: string) {
        const radioOption = $(`//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvCustomerName" and @text="${reason}"]`)

        await this.checkpointScreen('Qual é o motivo do reembolso?')

        await this.waitAndClick(radioOption)
        await this.waitAndClick(this.btnConfirmRefund)
    }

    async sendInvoicePhoto() {
        await this.checkpointScreen('Envie a foto da nota fiscal')
        await this.addPhoto('recipe.jpg')
        await this.waitAndClick(this.btnSendInvoice)
    }

    async sendRecipePhoto() {
        await this.checkpointScreen('Envie um ou mais arquivos da sua receita médica.')
        await this.addPhoto('recipe.jpg')
        await this.waitAndClick(this.btnSendRecipe)
    }

    async reportBankForRefund(bankName: string) {
        const selectBank = this.selectBank
        const inputAgency = this.inputAgency
        const inputAccount = this.inputAccount
        const inputDigit = this.inputDigit
        const btnConfirmDataBankPopUp = this.btnConfirmPopUp

        await this.checkpointScreen('Agora é só conferir ou alterar seus dados bancários cadastrados')
        await selectBank.waitForDisplayed({ timeout: 30000 })
        await selectBank.click()
        const optionBank = $(`${this.optionBank}//*[contains(@text,"${bankName}")]`)
        await optionBank.waitForDisplayed({ timeout: 30000 })
        await optionBank.click()

        await this.waitAndSetValue(inputAgency, '12345')
        await this.waitAndSetValue(inputAccount, '12345678')
        await this.waitAndSetValue(inputDigit, '9')
        await this.waitAndClick(this.btnConfirmDataBank)

        await this.checkpointScreen('Seus reembolsos serão realizados nesta conta')
        await this.waitAndClick(btnConfirmDataBankPopUp)
    }

    async viewCardRefundAndGetProtocol() {
        const cardRefund = $(`(${this.cardRefund})[1]`)
        await cardRefund.waitForDisplayed({ timeout: 15000 })

        const protocol = $(`(${this.cardRefund}//*[@resource-id="com.astl.vidalink.beta:id/tvRefundProtocol"])[1]`)
        await protocol.waitForDisplayed({ timeout: 15000 })
        const protocolNumber = await protocol.getText()
        await console.log(`${protocolNumber}`)
    }

    // ======== METHODS ========
    async requestNewRefund(medicineName: string, userName: string, reason: string) {
        const btnSolicitarReembolso = this.btnRequestRefund
        const labelSuccess = this.labelSuccess
        const labelDataSended = this.labelDataSended
        const btnConcluir = this.btnFinish

        await this.viewTollbarReembolso()
        await this.waitAndClick(btnSolicitarReembolso)
        await this.fillAndSelectMedicineName(medicineName)
        await this.whoIsTheRefundFor(userName)
        await this.whatIsReasonRefund(reason)
        await this.sendInvoicePhoto()
        await this.sendRecipePhoto()
        try {
        await this.reportBankForRefund('Banco do Brasil')
        } catch (error) { console.log('Fluxo sem preenchimento de dados bancários.') }
        await labelSuccess.waitForDisplayed({ timeout: 20000 })
        await labelDataSended.waitForDisplayed({ timeout: 10000 })
        await this.waitAndClick(btnConcluir)
        await this.viewCardRefundAndGetProtocol()
    }

    async validateRefundStatus(status: string) {
        await this.viewTollbarReembolso()
        const cardRefund = $(`(${this.cardRefund})[1]`)
        await cardRefund.waitForDisplayed({ timeout: 30000 })   

        const statusElement = $(this.refundStatus)
        await statusElement.waitForDisplayed()

        const statusAtual = await statusElement.getText()
        // console.log(`Status recebido na tela: ${statusAtual}`)
        await expect(statusAtual).toEqual(status)
    }

}

export default new ReembolsoAndroid()