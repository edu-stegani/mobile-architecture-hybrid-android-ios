import data from '../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, extratoScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const user = data.users.Marcia
const userPirelli = data.users.Edson

describe('Validação de tela em Extrato', () => {

    before(async () => {
        // preparando massa no banco
        await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
        await oracleHelpers.acceptTermAndConditions(user.cpf)
        await postgresHelper.updatePasswordForStrong(user.cpf)

        //login
        await AppHelper.login(user.cpf, user.password);
    })

    it('visualizar extrato de titular e dependentes', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Extrato')
        await extratoScreen.validationScreenExtrato(user.fullName)
    })

})

describe('Validação de tela em Extrato', () => {

    before(async () => {
        // preparando massa no banco
        await postgresHelper.updateRecognitionFace('NO_FACE', userPirelli.CT)
        await oracleHelpers.acceptTermAndConditions(userPirelli.cpf)
        await postgresHelper.updatePasswordForStrong(userPirelli.cpf)

        // login
        await AppHelper.login(userPirelli.cpf, userPirelli.password);
    })

    it('visualizar extrato de usuário Pirelli', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Extrato')
        await extratoScreen.validationScreenExtrato(userPirelli.fullName)
    })

})