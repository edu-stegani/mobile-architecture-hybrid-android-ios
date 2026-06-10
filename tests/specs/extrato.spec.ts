import data from '../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, extratoScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)
})

beforeEach(async () => {
    await AppHelper.login(user.cpf, user.password);
})

describe('Validação de tela em Extrato', () => {

    it('visualizar extrato de titular e dependentes', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Extrato')
        await extratoScreen.validationScreenExtrato(user.fullName)
    })

})