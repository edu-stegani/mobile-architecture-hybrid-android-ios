import data from '../../support/data/users.json' with { type: 'json' };
import { profileScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)
})

beforeEach(async () => {
    await AppHelper.login(user.cpf, user.password);
})

describe('Realizar logout', () => {

    it('fazer logout na aba perfil', async () => {
        await profileScreen.logout()
    })

    it('Navegação na tela perfil e validação das opções', async () => {
        await profileScreen.navigateMenuProfile(user.clientGroup)
    })

})