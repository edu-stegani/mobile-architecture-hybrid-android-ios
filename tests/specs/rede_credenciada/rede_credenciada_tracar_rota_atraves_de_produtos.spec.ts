import data from '../../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, redeCredenciadaScreen, produtosScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT);
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT);
    await oracleHelpers.acceptTermAndConditions(user.cpf);
    await driver.setGeoLocation({
        latitude: -23.615799,
        longitude: -46.570010,
    });

    await AppHelper.login(user.cpf, user.password);
})

it('Traçar rota de rede credenciada através de busca de produtos', async () => {
    await homeScreen.tapPilarByName('Med');
    await benefitsScreen.clickLinkByText('Produtos');
    await produtosScreen.searchProduct('DIPIRONA');
    await produtosScreen.selectTheFirstPharmacy();
    await redeCredenciadaScreen.traceRouteToPharmacy();
});