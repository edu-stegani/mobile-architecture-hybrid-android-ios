import data from '../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../support/utils/appHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { homeScreen, reembolsoScreen, benefitsScreen } from '../../screens/index.js'
import { before } from 'node:test';

const userCtExterno = data.users.William
const userCtVidalink = data.users.Eduardo

before(async () => {
    await oracleHelpers.resetBankData(userCtExterno.cpf)  //reseta os dados bancários do usuário para o teste de reembolso com CT externo
})

const performSetup = (user:  {cpf: string; password: string;} ) => {
    beforeEach(async () => {
        await AppHelper.login(user.cpf, user.password);
    });
};

describe('Solicitar Reembolso Vidalink: ', () => {
    performSetup(userCtVidalink)

    it('solicitar reembolso com CT vidalink', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Reembolso')
        await reembolsoScreen.requestNewRefund('PARACETAMOL', userCtVidalink.fullName ,'Falha no APP Vidalink')
    })
})

describe('Solicitar Reembolso CT Externo: ', () => {
    performSetup(userCtExterno)

    it('solicitar reembolso com CT externo fluxo informar dados bancários ', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Reembolso')
        await reembolsoScreen.requestNewRefund('RIVOTRIL', userCtExterno.fullName ,'Melhor preco da farmacia')
    })
})