import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

class ReembolsoIOS extends BaseScreen {

    // ====== SELECTORS ======
    get tollbarReembolso() {
        return $('~Reembolso')
    }

    get btnRequestRefund() {
        return $('//XCUIElementTypeButton[@label="Solicitar reembolso"]')
    }

    get inputMedicineName() {
        return $('//XCUIElementTypeTextField[@value="Buscar..."]')
    }

    get btnConfirmRefund() {
        return $('//XCUIElementTypeButton[@label="Confirmar"]')
    }

    get btnSendInvoice() {
        return $('//XCUIElementTypeButton[@name="Enviar nota fiscal"]')
    }

    get btnSendRecipe() {
        return $('//XCUIElementTypeButton[@name="Enviar receita"]')
    }

    get labelSuccess() {
        return $(`//XCUIElementTypeStaticText[@label="SUCESSO"]`)
    }

    get labelDataSended() {
        return $('~titleDataSend')
    }

    get btnFinish() {
        return $('//XCUIElementTypeButton[@label="Concluir"]')
    }

    get cardRefund() {
        return `//XCUIElementTypeTable/XCUIElementTypeCell`
    }

    get selectBank() {
        return $('(//XCUIElementTypeOther//XCUIElementTypeTextField)[1]')
    }

    get inputAgency() {
        return $('(//XCUIElementTypeOther//XCUIElementTypeTextField)[2]')
    }

    get inputAccount() {
        return $('(//XCUIElementTypeOther//XCUIElementTypeTextField)[3]')
    }

    get inputDigit() {
        return $('(//XCUIElementTypeOther//XCUIElementTypeTextField)[4]')
    }

    get btnConfirmDataBankPopUp() {
        return $(`//XCUIElementTypeButton[@label="Confirmar dados"]`)
    }

    get refundStatus() {
        return $(`(${this.cardRefund})[1]//*[@resource-id="com.astl.vidalink.beta:id/tvMedicineRefundStatus"]`)
    }

    // ======== ACTIONS ========
    async viewTollbarReembolso() {
        const tollbarReembolso = this.tollbarReembolso
        await tollbarReembolso.waitForDisplayed({ timeout: 10000 })
    }

    async fillAndSelectMedicineName(medicineName: string) {
        const inputNomeMedicamento = this.inputMedicineName
        const filteredOption = $(`//XCUIElementTypeTable//XCUIElementTypeStaticText[@name="${medicineName}"]`)
        const iconeDelete = this.btnDeleteIOS

        await this.checkpointScreen('Informe os nomes dos medicamentos para solicitar o reembolso')
        await this.waitAndSetValue(inputNomeMedicamento, medicineName)

        await this.waitAndClick(filteredOption)
        await iconeDelete.waitForDisplayed();

        await this.hideKeyboard()
        await this.waitAndClick(this.btnConfirmRefund)
    }

    async whoIsTheRefundFor(userName: string) {
        const btnRadioUser = $(`//XCUIElementTypeStaticText[contains(@value, '${userName}')]/../XCUIElementTypeButton[@label="ic prescription radio unselect"]`)

        await this.checkpointScreen('Para quem é o reembolso?')
        await this.waitAndClick(btnRadioUser)

        try { await this.hideKeyboard() } catch (error) { }
        await this.waitAndClick(this.btnConfirmRefund)
    }

    async whatIsReasonRefund(reason: string) {
        const radioOption = $(`//XCUIElementTypeStaticText[contains(@value, '${reason}')]/../XCUIElementTypeButton[@label="ic prescription radio unselect"]`)

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
        await this.checkpointScreen('Envie um ou mais arquivos da sua receita médica')
        await this.addPhoto('recipe.jpg')
        await this.waitAndClick(this.btnSendRecipe)
    }

    async reportBankForRefund(bankName: string) {
        const optionBank = $(`//XCUIElementTypeCell[.//XCUIElementTypeStaticText[contains(@label, "${bankName}")]]`)
        const inputBank = this.selectBank
        const inputAgency = this.inputAgency
        const inputAccount = this.inputAccount
        const inputDigit = this.inputDigit
        const btnConfirmDataBankPopUp = this.btnConfirmDataBankPopUp

        await this.checkpointScreen('Agora é só conferir ou alterar seus dados bancários cadastrados')
        await this.waitAndClick(inputBank)
        await this.waitAndClick(optionBank)
        await this.waitAndSetValue(inputAgency, '1234')
        try { await this.hideKeyboard() } catch (error) { }
        await this.waitAndSetValue(inputAccount, '12345678')
        try { await this.hideKeyboard() } catch (error) { }
        await this.waitAndSetValue(inputDigit, '9')
        try { await this.hideKeyboard() } catch (error) { }
        await this.waitAndClick(this.btnConfirmRefund)

        await this.checkpointScreen('Seus reembolsos serão realizados nesta conta')
        await this.waitAndClick(btnConfirmDataBankPopUp)
    }

    async viewCardRefundAndGetProtocol() {
        const cardRefund = $(`(${this.cardRefund})[1]`)
        await cardRefund.waitForDisplayed({ timeout: 15000 })

        const protocol = $(`(${this.cardRefund}//XCUIElementTypeStaticText[2])[1]`)
        const labelTexto = await protocol.getAttribute('label');
        const protocolValue = labelTexto?.match(/Protocolo:\s\d+/);

        await protocol.waitForDisplayed({ timeout: 15000 })
        await console.log(`${protocolValue}`)
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

    async newRefundUsingCamera(medicineName: string, userName: string, reason: string) {
        const btnSolicitarReembolso = this.btnRequestRefund

        await this.viewTollbarReembolso()
        await this.waitAndClick(btnSolicitarReembolso)
        await this.fillAndSelectMedicineName(medicineName)
        await this.whoIsTheRefundFor(userName)
        await this.whatIsReasonRefund(reason)
        
        await this.checkpointScreen('Envie a foto da nota fiscal')
        // await this.takePhoto()
        // await this.takePhoto()
        await this.waitAndClick(this.btnSendInvoice)

        await this.checkpointScreen('Envie um ou mais arquivos da sua receita médica.')
        // await this.takePhoto()
        // await this.takePhoto()
        await this.waitAndClick(this.btnSendRecipe)

        await this.labelSuccess.waitForDisplayed({ timeout: 20000 })
        await this.labelDataSended.waitForDisplayed({ timeout: 10000 })
        await this.waitAndClick(this.btnFinish)
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

export default new ReembolsoIOS()