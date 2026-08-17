import data from '../../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen, extratoScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const user = data.users.Eduardo

beforeEach(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)
    await postgresHelper.updatePasswordForStrong(user.cpf)
    await postgresHelper.resetPasswordCount(0, user.cpf);

    await AppHelper.login(user.cpf, user.password);
});

it('visualizar extrato de usuário Pirelli', async () => {
    await homeScreen.tapPilarByName('Med')
    await benefitsScreen.clickLinkByText('Extrato')
    await extratoScreen.validationScreenExtrato(user.fullName)
})