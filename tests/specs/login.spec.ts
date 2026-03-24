import { users } from '../../support/data/users.js'
import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import  postgresHelper  from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'

const data = users.ctMilenar

describe('login no app', () => {

  afterEach(async () => {
    await profileScreen.logout()
  })

  it('login com sucesso - com validação matricula', async () => {
    await postgresHelper.updatePasswordForWeakPass(data.cpf)  // query alterar para senha fraca 6 digitos
    await oracleHelpers.acceptTermAndConditions(data.cpf) // query que aceita termo e condições

    await loginScreen.login( data.cpf, '123456' )
    await loginScreen.fillMatricula(data.matricula)
    await homeScreen.checkDashboard()
  })

  it('login com sucesso - sem validação matricula', async () => {
    await postgresHelper.updatePasswordForStrong(data.cpf)  // query alterar para senha forte
    await oracleHelpers.acceptTermAndConditions(data.cpf) // query que aceita termo e condições

    await loginScreen.login( data.cpf, data.senha )
    await homeScreen.checkDashboard()
  })

})

describe('fluxos negativos - login no app', () => {

  it('senha incorreta', async () => {
    await postgresHelper.resetPasswordCount(0, data.cpf); // query resetando a contagem de senha incorreta

    await loginScreen.login( data.cpf, 'senha-incorreta' )
    await loginScreen.viewMessageError()
  })

})