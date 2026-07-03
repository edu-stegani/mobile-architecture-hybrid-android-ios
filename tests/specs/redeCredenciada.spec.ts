import data from '../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, redeCredenciadaScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../support/utils/appHelper.js'

const userVidalink = data.users.Eduardo
const userNestle = data.users.Roberto

before(async () => {
    await driver.setGeoLocation({
        latitude: -23.615799,
        longitude: -46.570010,
    });
})

const performSetup = (user: { cpf: string; password: string; CT: string }) => {
    beforeEach(async () => {
        await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
        await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
        await oracleHelpers.acceptTermAndConditions(user.cpf)

        await AppHelper.login(user.cpf, user.password);
    });
};

describe('Navegar por Rede Credenciada - Farmácias e Manipulados', () => {
    performSetup(userVidalink)

    it('Navegar por Rede Credenciada - Farmácias e Manipulados', async () => {
        performSetup(userVidalink)
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Rede Credenciada')
        await redeCredenciadaScreen.navigateToRedeCredenciada()
    })

})

describe('Navegar por Rede Credenciada Nestle - Farmácias, Vacinas e Manipulados', () => {
    performSetup(userNestle)

    it('Navegar por Rede Credenciada Nestle - Farmácias, Vacinas e Manipulados', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Rede Credenciada')
        await redeCredenciadaScreen.navigateToRedeCredenciada()
    })
})


