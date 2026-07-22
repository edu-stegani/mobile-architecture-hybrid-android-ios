import data from '../../support/data/users.json' with { type: 'json' };
import { profileScreen, homeScreen, cardScreen, produtosScreen, extratoScreen, redeCredenciadaScreen} from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'


const user = data.users.Eduardo
const userAfinidade = data.users.Paulo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)

    await postgresHelper.updateRecognitionFace('NO_FACE', userAfinidade.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', userAfinidade.CT)
    await oracleHelpers.acceptTermAndConditions(userAfinidade.cpf)
})

describe('Realizar logout', () => {

    beforeEach(async () => {
        await AppHelper.login(user.cpf, user.password);
    })

    it('fazer logout na aba perfil', async () => {
        await profileScreen.waitAndClick(profileScreen.perfilTab)
        await profileScreen.logout()
    })

    it('Navegação na tela perfil e validação das opções', async () => {
        await profileScreen.navigateMenuProfile(user.clientGroup)
    })

})

describe('Acesso personalizado: ', () => {
    beforeEach(async () => {
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
})