import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await postgresHelper.deleteUserBySocialId(user.cpf)
    await oracleHelpers.acceptTermAndConditions(user.cpf)

    await AppHelper.resetApp();
})

it('primeiro acesso sem facial', async () => {

    await loginScreen.firstAccess(user.cpf, user.birthdate, user.matricula)
    await loginScreen.informEmailAndCellphone('primeiro@acesso.com.br', '11958048513')
    await loginScreen.validatingData(user.cpf, user.password)
    await loginScreen.checkpointScreen('SUCESSO')
    await homeScreen.checkDashboard()

})


    // await loginScreen.checkpointScreen('Validação de identidade')
    // const labelValidaIdentidade = $('//android.widget.TextView[@text="Antes de seguir, vamos fazer algumas validações rápidas de identidade."]')
    // await labelValidaIdentidade.waitForDisplayed({ timeout: 10000 })
    // await loginScreen.waitAndClick(loginScreen.btnConfirmPopUp)

    // await loginScreen.checkpointScreen('Selecione o tipo de documento')
    // const optionDoc = $(`//android.widget.TextView[contains(@text, 'CNH')]`)
    // await loginScreen.waitAndClick(optionDoc)

    // // 1. Faz o upload da imagem e força a indexação na galeria do Android
    // // para garantir que ela apareça como a mais recente.
    // await loginScreen.uploadImageFromProject('doc.jpg');
    // // if (driver.isAndroid && remotePath) {
    // //     await driver.execute('mobile: shell', {
    // //         command: 'am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d',
    // //         args: [`file://${remotePath}`]
    // //     });
    // //     await driver.pause(1000); // Pequena pausa para o sistema processar o scan.
    // // }

    // await loginScreen.checkpointScreen('Dicas para uma boa foto')
    // await loginScreen.waitAndClick(loginScreen.btnConfirmPopUp)

    // const galleryIcon = $('id:com.astl.vidalink.beta:id/vGallery2')
    // await loginScreen.waitAndClick(galleryIcon)
    // await driver.pause(2000); // Pausa para a UI da galeria carregar

    // // 2. Seleciona a imagem mais recente, que agora deve ser a primeira.
    // const photo = await loginScreen.getPhotoElement()
    // await photo.click()

    // const btnDone = driver.isIOS
    //     ? $('//XCUIElementTypeButton[@label="Done"]')
    //     : $('//android.widget.TextView[@text="Done"]');
    // if (await btnDone.isDisplayed()) {
    //     await loginScreen.waitAndClick(btnDone)
    // }

    // await loginScreen.checkpointScreen('A foto está nítida e legível?')
    // const yesSend = $('id:com.astl.vidalink.beta:id/btYes')
    // await loginScreen.waitAndClick(yesSend)

    // await loginScreen.checkpointScreen('Dicas para uma boa selfie')
    // await loginScreen.waitAndClick(loginScreen.btnConfirmPopUp)

    // const screenSelfie = $(`id:com.astl.vidalink.beta:id/ivSelfiePlaceholder`)
    // await screenSelfie.waitForDisplayed({ timeout: 10000 })
    // const takePicture = $(`id:com.astl.vidalink.beta:id/ivTakePicture2`)
    // await loginScreen.waitAndClick(takePicture)

    // await loginScreen.checkpointScreen('A foto ficou boa?')
    // await loginScreen.waitAndClick(yesSend)
