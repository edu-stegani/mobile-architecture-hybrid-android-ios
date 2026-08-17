import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, cardScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
  await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
  await oracleHelpers.acceptTermAndConditions(user.cpf)
  await postgresHelper.updatePasswordForStrong(user.cpf)
  await postgresHelper.resetPasswordCount(0, user.cpf);

  await AppHelper.resetApp();
})

it('login com usuário em multiplos planos', async () => {
  await loginScreen.login(user.cpf, user.password)
  await homeScreen.checkDashboard()
  await cardScreen.validateCardsMultiplePlans(user.fullName, user.clientGroup, user.clientGroup2)
})
