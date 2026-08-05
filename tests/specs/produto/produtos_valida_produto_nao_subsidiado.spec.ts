import data from '../../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../../support/utils/appHelper.js'
import { homeScreen, benefitsScreen, produtosScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js';
import oracleHelpers from '../../../support/utils/oracleHelpers.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)

    await driver.setGeoLocation({
        latitude: -23.615799,
        longitude: -46.570010,
    });

    await AppHelper.login(user.cpf, user.password);
})

it('realizar a busca de um produto não subsiado', async () => {
    await homeScreen.tapPilarByName('Med')
    await benefitsScreen.clickLinkByText('Produtos')
    await produtosScreen.searchProduct('OZEMPIC')
    await produtosScreen.productNoSubsidy()
})