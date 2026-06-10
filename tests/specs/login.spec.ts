import data from '../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
  await oracleHelpers.acceptTermAndConditions(user.cpf)
})

beforeEach(async () => {
  await AppHelper.resetApp();
})

describe('Login no App', () => {

  it('login com sucesso - com validação matricula', async () => {
    await postgresHelper.updatePasswordForWeakPass(user.cpf)  // query alterar para senha fraca 6 digitos

    await loginScreen.login(user.cpf, '123456')
    await loginScreen.fillMatricula(user.matricula)
    await homeScreen.checkDashboard()
  })

  it('login com sucesso - sem validação matricula', async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)  // query alterar para senha forte

    await loginScreen.login(user.cpf, user.password)
    await homeScreen.checkDashboard()
    await profileScreen.logout()
  })

  it('senha incorreta', async () => {
    await postgresHelper.resetPasswordCount(0, user.cpf); // query resetando a contagem de senha incorreta

    await loginScreen.login(user.cpf, 'senha-incorreta')
    await loginScreen.viewMessageError()
  })

})

describe('Esqueci minha senha', () => {

  beforeEach(async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)
  })

  it('esqueci minha senha', async () => {
    await loginScreen.locateRegistration(user.cpf, user.birthdate, user.matricula)
    await loginScreen.informTokenSMS(user.cpf)
    await loginScreen.informNewPassword('Teste123')
    await loginScreen.checkpointScreen('SUCESSO')
    await homeScreen.checkDashboard()
  })

  it('senha igual a anterior', async () => {
    await loginScreen.locateRegistration(user.cpf, user.birthdate, user.matricula)
    await loginScreen.informTokenSMS(user.cpf)
    await loginScreen.informNewPassword(user.password)
    await loginScreen.passwordCantBeEqualPrevious()
  })

})
