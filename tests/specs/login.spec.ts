import data from '../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'
import { only } from 'node:test';

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
})

beforeEach(async () => {
  await AppHelper.resetApp();
})

describe('login no app', () => {

  afterEach(async () => {
    await profileScreen.logout()
  })

  it('login com sucesso - com validação matricula', async () => {
    await postgresHelper.updatePasswordForWeakPass(user.cpf)  // query alterar para senha fraca 6 digitos
    await oracleHelpers.acceptTermAndConditions(user.cpf) // query que aceita termo e condições

    await loginScreen.login(user.cpf, '123456')
    await loginScreen.fillMatricula(user.matricula)
    await homeScreen.checkDashboard()
  })

  it('login com sucesso - sem validação matricula', async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)  // query alterar para senha forte
    await oracleHelpers.acceptTermAndConditions(user.cpf) // query que aceita termo e condições

    await loginScreen.login(user.cpf, user.password)
    await homeScreen.checkDashboard()
  })



})

describe('fluxos negativos - login no app', () => {

  it('senha incorreta', async () => {
    await postgresHelper.resetPasswordCount(0, user.cpf); // query resetando a contagem de senha incorreta

    await loginScreen.login(user.cpf, 'senha-incorreta')
    await loginScreen.viewMessageError()
  })

})

it.only('esqueci minha senha', async () => {
  
  await loginScreen.locateRegistration(user.cpf, user.birthdate, user.matricula)
  await loginScreen.informTokenSMS(user.cpf)
  await loginScreen.informNewPassword('Teste111') // deixar essa senha randomica
  await homeScreen.checkDashboard()

})

// Atenção!
// A nova senha não pode ser igual a senha anterior.
// com.astl.vidalink.beta:id/tvMessage
// com.astl.vidalink.beta:id/btConfirm