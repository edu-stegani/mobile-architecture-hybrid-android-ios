import data from '../../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../../support/utils/appHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import { homeScreen, reembolsoScreen, benefitsScreen } from '../../../screens/index.js'

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)

    await AppHelper.login(user.cpf, user.password);
})

it('solicitar reembolso com CT vidalink', async () => {
    await homeScreen.tapPilarByName('Med')
    await benefitsScreen.clickLinkByText('Reembolso')
    await reembolsoScreen.requestNewRefund('PARACETAMOL', user.fullName, 'Falha no APP Vidalink')
})