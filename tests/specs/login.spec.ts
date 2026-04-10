import data from '../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import  postgresHelper  from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { only } from 'node:test';

const user = data.users.Eduardo

describe('login no app', () => {

  afterEach(async () => {
    await profileScreen.logout()
  })

  it('login com sucesso - com validação matricula', async () => {
    await postgresHelper.updatePasswordForWeakPass(user.cpf)  // query alterar para senha fraca 6 digitos
    await oracleHelpers.acceptTermAndConditions(user.cpf) // query que aceita termo e condições

    await loginScreen.login( user.cpf, '123456' )
    await loginScreen.fillMatricula(user.matricula)
    await homeScreen.checkDashboard()
  })

  it('login com sucesso - sem validação matricula', async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)  // query alterar para senha forte
    await oracleHelpers.acceptTermAndConditions(user.cpf) // query que aceita termo e condições

    await loginScreen.login( user.cpf, user.password )
    await homeScreen.checkDashboard()
  })

})

describe('fluxos negativos - login no app', () => {

  it('senha incorreta', async () => {
    await postgresHelper.resetPasswordCount(0, user.cpf); // query resetando a contagem de senha incorreta

    await loginScreen.login( user.cpf, 'senha-incorreta' )
    await loginScreen.viewMessageError()
  })

})