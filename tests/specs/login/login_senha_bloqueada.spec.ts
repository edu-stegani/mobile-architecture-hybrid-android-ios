import data from '../../../support/data/users.json' with { type: 'json' };
import { loginScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updatePasswordForStrong(user.cpf)
  await postgresHelper.resetPasswordCount(3, user.cpf);

  await AppHelper.resetApp();
})

it('senha bloqueada', async () => {
  await loginScreen.tapEntrar()
  await loginScreen.fillCpf(user.cpf)
  await loginScreen.fillSenha(user.password)
  await loginScreen.waitAndClick(loginScreen.btnAcessar)
  await loginScreen.viewMessageError('Atenção')
  await loginScreen.viewMessageError('Sua senha foi bloqueada, gostaria de fazer uma nova?')
})