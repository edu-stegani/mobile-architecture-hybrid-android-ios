import { loginScreen } from '../../../screens/index.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

before(async () => {
  await AppHelper.resetApp();
})

it('login com cpf inválido', async () => {
  await loginScreen.tapEntrar()
  await loginScreen.fillCpf('00000000000')
  await loginScreen.viewMessageError('CPF inválido')
})