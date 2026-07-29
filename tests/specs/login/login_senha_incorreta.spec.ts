import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updatePasswordForStrong(user.cpf)
  await postgresHelper.resetPasswordCount(0, user.cpf);

  await AppHelper.resetApp();
})

it('senha incorreta', async () => {
  await loginScreen.login(user.cpf, 'senha-incorreta')
  await loginScreen.viewMessageError('Senha incorreta')
})