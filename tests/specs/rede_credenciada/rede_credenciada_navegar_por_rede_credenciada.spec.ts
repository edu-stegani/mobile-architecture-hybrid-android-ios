import data from '../../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, redeCredenciadaScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const userVidalink = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', userVidalink.CT);
    await postgresHelper.removeLinkTutorialWithCT('2', userVidalink.CT);
    await oracleHelpers.acceptTermAndConditions(userVidalink.cpf);
    await driver.setGeoLocation({
        latitude: -23.615799,
        longitude: -46.570010,
    });

    await AppHelper.login(userVidalink.cpf, userVidalink.password);
})

it('Navegar por Rede Credenciada - Farmácias e Manipulados', async () => {
    await homeScreen.tapPilarByName('Med');
    await benefitsScreen.clickLinkByText('Rede Credenciada');
    await redeCredenciadaScreen.navigateToRedeCredenciada();
});
