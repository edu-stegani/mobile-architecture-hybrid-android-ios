import data from '../../../support/data/users.json' with { type: 'json' };
import { cardScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await postgresHelper.updatePasswordForStrong(user.cpf)
    await oracleHelpers.acceptTermAndConditions(user.cpf)
})

it('validar cartões após fechar e reabrir app', async () => {
    await AppHelper.loginKeepConnected(user.cpf, user.password)
    await cardScreen.validateCardsAfterClose(user.fullName, user.dependents[0].fullName, user.dependents[1].fullName)
})