import data from '../../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../../support/utils/appHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import { homeScreen, reembolsoScreen, benefitsScreen } from '../../../screens/index.js'
import * as apiHelpers from '../../../support/utils/apiHelpers.js'


const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.updatePasswordForStrong(user.cpf)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)

    await apiHelpers.sendRefundAndApprove(user);

    await AppHelper.login(user.cpf, user.password)
})

it('validar reembolso com status aprovado', async () => {
    await homeScreen.tapPilarByName('Med')
    await benefitsScreen.clickLinkByText('Reembolso')
    await reembolsoScreen.validateRefundStatus('Aprovado')
})