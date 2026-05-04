import data from '../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../support/utils/appHelper.js'
import { homeScreen, reembolsoScreen, benefitsScreen } from '../../screens/index.js'


describe('Solicitar Reembolso Vidalink: ', () => {
    const user = data.users.Eduardo

    beforeEach(async () => {
        await AppHelper.resetAndLogin(user.cpf, user.password);
    })

    it('solicitar reembolso com sucesso', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Reembolso')
        await reembolsoScreen.requestNewRefund('PARACETAMOL', user.fullName ,'Falha no APP Vidalink')
    })

})

describe('Solicitar Reembolso CT Externo: ', () => {
    const user = data.users.William

    beforeEach(async () => {
        await AppHelper.resetAndLogin(user.cpf, user.password);
    })

    it('solicitar reembolso com sucesso', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Reembolso')
        await reembolsoScreen.requestNewRefund('RIVOTRIL', user.fullName ,'Melhor preco da farmacia')
    })

})