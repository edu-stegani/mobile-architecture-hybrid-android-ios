import data from '../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, cardScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const user = data.users.Eduardo
const userMultiplePlans = data.users.Isis
const userCT580 = data.users.Marcia

before(async () => {
  await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
  await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
  await oracleHelpers.acceptTermAndConditions(user.cpf)

  await postgresHelper.updateRecognitionFace('NO_FACE', userMultiplePlans.CT)
  await oracleHelpers.acceptTermAndConditions(userMultiplePlans.cpf)

  await postgresHelper.updateRecognitionFace('NO_FACE', userCT580.CT)
  await postgresHelper.updatePasswordForStrong(userCT580.cpf)  // query alterar para senha forte
  await postgresHelper.removeLinkTutorialWithCT('2', userCT580.CT)
  await oracleHelpers.acceptTermAndConditions(userCT580.cpf)
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
  })

  it('senha incorreta', async () => {
    await postgresHelper.resetPasswordCount(0, user.cpf); // query resetando a contagem de senha incorreta

    await loginScreen.login(user.cpf, 'senha-incorreta')
    await loginScreen.viewMessageError('Senha incorreta')
  })

  it('login negando termos e condições', async () => {
    await oracleHelpers.resetTermAndConditions(user.cpf); // query resetando o aceite do termo

    await loginScreen.login(user.cpf, user.password)
    await loginScreen.rejectTermsAndConditions()
  })

  it('login com usuário em multiplos planos', async () => {
    await postgresHelper.updatePasswordForStrong(userMultiplePlans.cpf)  // query alterar para senha forte 
    await postgresHelper.resetPasswordCount(0, userMultiplePlans.cpf);

    await loginScreen.login(userMultiplePlans.cpf, userMultiplePlans.password)
    await homeScreen.checkDashboard()
    await cardScreen.validateCardsMultiplePlans(userMultiplePlans.fullName, userMultiplePlans.clientGroup, userMultiplePlans.clientGroup2)

  })

  it('login com cpf inválido', async () => {
    await loginScreen.tapEntrar()
    await loginScreen.fillCpf('00000000000')
    await loginScreen.viewMessageError('CPF inválido')
  })

  it('senha bloqueada', async () => {
    await postgresHelper.resetPasswordCount(3, userCT580.cpf);

    await loginScreen.tapEntrar()
    await loginScreen.fillCpf(userCT580.cpf)
    await loginScreen.fillSenha(userCT580.password)
    await loginScreen.waitAndClick(loginScreen.btnAcessar)
    await loginScreen.viewMessageError('Atenção')
    await loginScreen.viewMessageError('Sua senha foi bloqueada, gostaria de fazer uma nova?')
  })

})

describe('Esqueci minha senha', () => {

  it('esqueci minha senha', async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)
    await oracleHelpers.acceptTermAndConditions(user.cpf)

    await loginScreen.locateRegistration(user.cpf, user.birthdate, user.matricula)
    await loginScreen.informTokenSMS(user.cpf)
    await loginScreen.informNewPassword()
    await loginScreen.checkpointScreen('SUCESSO')
    await homeScreen.checkDashboard()
  })

  it('senha igual a anterior', async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)

    await loginScreen.locateRegistration(user.cpf, user.birthdate, user.matricula)
    await loginScreen.informTokenSMS(user.cpf)
    await loginScreen.informNewPassword(user.password) 
    await loginScreen.passwordCantBeEqualPrevious()
  })

})
