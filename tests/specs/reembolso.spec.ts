import data from '../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../support/utils/appHelper.js'
import { loginScreen, homeScreen, profileScreen, benefitsScreen } from '../../screens/index.js'
import { only } from 'node:test';

// before(async () => { })

describe('Solicitar Reembolso Vidalink: ', () => {
    const user = data.users.Eduardo

    beforeEach(async () => {
        await AppHelper.resetAndLogin(user.cpf, user.password);
    })

    it('solicitar reembolso com sucesso', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Reembolso')

        const tollbarReembolso = $('//android.widget.TextView[@text="Reembolso"]')
        await tollbarReembolso.waitForDisplayed({ timeout: 5000 })

        const btnSolicitarReembolso = $('id:com.astl.vidalink.beta:id/btRequestRefund')
        await btnSolicitarReembolso.waitForDisplayed({ timeout: 5000 })
        await btnSolicitarReembolso.click();

        // tela nome de medicamento para reembolso
        const labelNomeMedicamento = $('//*[@text="Informe os nomes dos medicamentos para solicitar o reembolso"]')
        await labelNomeMedicamento.waitForDisplayed({ timeout: 5000 })

        const inputNomeMedicamento = $('id:com.astl.vidalink.beta:id/etMedicineName')
        await inputNomeMedicamento.waitForDisplayed({ timeout: 5000 })
        await inputNomeMedicamento.setValue('DIPIRONA')

        const filteredOption = $('//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvMedicineName" and @text="DIPIRONA"]')
        await filteredOption.waitForDisplayed({ timeout: 20000 })
        await filteredOption.click()
        await $('id:com.astl.vidalink.beta:id/btDeleteRecipe').waitForDisplayed();

        const btnConfirmarReembolso = $('id:com.astl.vidalink.beta:id/btnNextRefundRequest');
        await btnConfirmarReembolso.waitForDisplayed({ timeout: 5000 })
        await btnConfirmarReembolso.click();

        // pra quem é o reembolso
        const labelPraQuem = $('//*[@text="Para quem é o reembolso?"]')
        await labelPraQuem.waitForDisplayed({ timeout: 5000 })

        const btnRadioUser = $('//android.widget.TextView[contains(@text,"EDUARDO STEGANI")]')
        await btnRadioUser.waitForDisplayed({ timeout: 5000 })
        await btnRadioUser.click();

        await btnConfirmarReembolso.waitForDisplayed({ timeout: 5000 })
        await btnConfirmarReembolso.click();

        const labelQualMotivo = $('//*[@text="Qual é o motivo do reembolso?"]')
        await labelQualMotivo.waitForDisplayed({ timeout: 5000 })

        const radioOption = $('//android.widget.TextView[@resource-id="com.astl.vidalink.beta:id/tvCustomerName" and @text="Falha no APP Vidalink"]')
        await radioOption.waitForDisplayed({ timeout: 5000 })
        await radioOption.click();

        await btnConfirmarReembolso.waitForDisplayed({ timeout: 5000 })
        await btnConfirmarReembolso.click();

        // envie nota fiscal
        const labelEnvieNota = $('//*[@text="Envie a foto da nota fiscal"]')
        await labelEnvieNota.waitForDisplayed({ timeout: 5000 })

        const btnAddFoto = $('id:com.astl.vidalink.beta:id/text_input_end_icon')
        await btnAddFoto.waitForDisplayed({ timeout: 5000 })

        const btnGaleria = $('id:com.astl.vidalink.beta:id/tvSecondOption')
        await btnGaleria.waitForDisplayed({ timeout: 5000 })
        await btnGaleria.click();

        const photo = $(`android=new UiSelector().descriptionStartsWith("Photo taken on").instance(0)`);
        await photo.waitForDisplayed({ timeout: 20000 })
        await photo.click();

        const btnDone = $('//android.widget.TextView[@text="Done"]')
        await btnDone.waitForDisplayed({ timeout: 5000 })
        await btnDone.click();
        const iconDeletePhoto = $('id:com.astl.vidalink.beta:id/btDeletePicture')
        await iconDeletePhoto.waitForDisplayed({ timeout: 5000 })



    })

})