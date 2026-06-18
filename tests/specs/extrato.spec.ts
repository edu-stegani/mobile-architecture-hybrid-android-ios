import data from '../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, extratoScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const userWithDependents = data.users.Marcia
const userPirelli = data.users.Edson

const performSetup = (user:  {cpf: string; password: string; CT: string} ) => {
    beforeEach(async () => {
        await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
        await oracleHelpers.acceptTermAndConditions(user.cpf)
        await postgresHelper.updatePasswordForStrong(user.cpf)
        await postgresHelper.resetPasswordCount(0, user.cpf);

        await AppHelper.login(user.cpf, user.password);
    });
};

describe('Validação de tela em Extrato', () => {
    performSetup(userWithDependents)

    it('visualizar extrato de titular e dependentes', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Extrato')
        await extratoScreen.validationScreenExtrato(userWithDependents.fullName)
    })

})

describe('Validação de tela em Extrato para Usuário Pirelli', () => {
    performSetup(userPirelli)

    it('visualizar extrato de usuário Pirelli', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Extrato')
        await extratoScreen.validationScreenExtrato(userPirelli.fullName)
    })

})