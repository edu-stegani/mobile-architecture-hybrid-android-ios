import data from '../../../support/data/users.json' with { type: 'json' };
import { profileScreen, homeScreen, cardScreen, produtosScreen, extratoScreen, redeCredenciadaScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const userAfinidade = data.users.Paulo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', userAfinidade.CT)
    await postgresHelper.resetPasswordCount(0, userAfinidade.cpf)
    await postgresHelper.updatePasswordForStrong(userAfinidade.cpf)
    await postgresHelper.removeLinkTutorialWithCT('2', userAfinidade.CT)
    await oracleHelpers.acceptTermAndConditions(userAfinidade.cpf)

    await driver.setGeoLocation({
        latitude: -23.615799,
        longitude: -46.570010,
    });

    await AppHelper.login(userAfinidade.cpf, userAfinidade.password);
})

it('acesso personalizado CT afinidade', async () => {
    await homeScreen.validateHomeAfinidade()
    await cardScreen.validateCardAfinidade(userAfinidade.fullName, userAfinidade.cardNumber)
    await redeCredenciadaScreen.validateRedeAfinidade()
    await produtosScreen.waitAndClick(produtosScreen.produtosTab)
    await produtosScreen.viewTollbarBuscarMedicamentos()
    await extratoScreen.waitAndClick(extratoScreen.extratoTab)
    await extratoScreen.viewScreenExtrato(userAfinidade.fullName)
    await homeScreen.waitAndClick(homeScreen.homeTab)
    await homeScreen.waitAndClick(homeScreen.iconConfiguration)
    await profileScreen.logout()
})