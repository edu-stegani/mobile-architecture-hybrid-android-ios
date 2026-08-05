import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
  await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
  await oracleHelpers.acceptTermAndConditions(user.cpf)
  await postgresHelper.updatePasswordForWeakPass(user.cpf)

  await AppHelper.resetApp();
})

it('login com sucesso - com validação matricula', async () => {
  await loginScreen.login(user.cpf, '123456')
  await loginScreen.fillMatricula(user.matricula)
  await homeScreen.checkDashboard()
})