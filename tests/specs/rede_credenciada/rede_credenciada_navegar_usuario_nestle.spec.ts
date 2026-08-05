import data from '../../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, redeCredenciadaScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const userNestle = data.users.Roberto

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', userNestle.CT);
    await postgresHelper.removeLinkTutorialWithCT('2', userNestle.CT);
    await oracleHelpers.acceptTermAndConditions(userNestle.cpf);
    await driver.setGeoLocation({
        latitude: -23.615799,
        longitude: -46.570010,
    });

    await AppHelper.login(userNestle.cpf, userNestle.password);
})

it('Navegar por Rede Credenciada Nestle - Farmácias, Vacinas e Manipulados', async () => {
    await homeScreen.tapPilarByName('Med');
    await benefitsScreen.clickLinkByText('Rede Credenciada');
    await redeCredenciadaScreen.navigateToRedeCredenciada();
});