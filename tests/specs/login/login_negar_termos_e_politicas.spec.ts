import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
  await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
  await oracleHelpers.resetTermAndConditions(user.cpf);
  await postgresHelper.updatePasswordForStrong(user.cpf)

  await AppHelper.resetApp();
})

it('login negando termos e condições', async () => {
  await loginScreen.login(user.cpf, user.password)
  await loginScreen.rejectTermsAndConditions()
})