import { users } from '../../support/data/users.js'
import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import  dbHelper  from '../../support/utils/dbHelper.js'

const data = users.ctVidalink

describe('login no app', () => {

  afterEach(async () => {
    await profileScreen.logout()
  })

  it('login com sucesso - com validação matricula', async () => {
    await dbHelper.updatePasswordForWeakPass(data.cpf)  // query alterar para senha fraca 6 digitos

    await loginScreen.login( data.cpf, '123456' )
    await loginScreen.fillMatricula(data.matricula)
    await homeScreen.checkDashboard()
  })

  it('login com sucesso - sem validação matricula', async () => {
    await dbHelper.updatePasswordForStrong(data.cpf)  // query alterar para senha forte

    await loginScreen.login( data.cpf, data.senha )
    await homeScreen.checkDashboard()
  })

})

describe('fluxos negativos - login no app', () => {

  it('senha incorreta', async () => {
    await dbHelper.simpleResetPasswordCount(0, data.cpf); // query resetando a contagem de senha incorreta

    await loginScreen.login( data.cpf, 'senha-incorreta' )
    await loginScreen.viewMessageError('Senha incorreta')
  })

})