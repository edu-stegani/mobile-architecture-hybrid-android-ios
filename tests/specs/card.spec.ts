import data from '../../support/data/users.json' with { type: 'json' };
import { cardScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const user = data.users.William

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)
})

beforeEach(async () => {
    await AppHelper.login(user.cpf, user.password);
})

describe('Validar cartões titular e dependentes: ', () => {

    it('valida cartões na tela Home e Cartão', async () => {
        await cardScreen.navigationAndViewCards(user.fullName, user.dependents[0].fullName, user.dependents[1].fullName)
    })

})