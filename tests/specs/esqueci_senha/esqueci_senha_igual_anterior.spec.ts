import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
  await postgresHelper.updatePasswordForStrong(user.cpf)
  await postgresHelper.updatePasswordForStrong(user.cpf)

  await AppHelper.resetApp();
})

it('senha igual a anterior', async () => {
  await loginScreen.locateRegistration(user.cpf, user.birthdate, user.matricula)
  await loginScreen.informTokenSMS(user.cpf)
  await loginScreen.informNewPassword(user.password)
  await loginScreen.passwordCantBeEqualPrevious()
})