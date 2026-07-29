import data from '../../../support/data/users.json' with { type: 'json' };
import { homeScreen, receitaScreen, benefitsScreen } from '../../../screens/index.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { flowSendRecipe } from '../../../support/utils/apiHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'

const user = data.users.Eduardo;

before(async () => {
    await flowSendRecipe(user);
    await postgresHelper.updateRecognitionFace('NO_FACE', user.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', user.CT)
    await oracleHelpers.acceptTermAndConditions(user.cpf)
    await postgresHelper.removeLinkTutorialWithCT('20', user.CT)

    await AppHelper.login(user.cpf, user.password);
})

it('consultar receitas cadastradas', async () => {
    await homeScreen.tapPilarByName('Med')
    await benefitsScreen.clickLinkByText('Histórico de receitas')
    await receitaScreen.checkReceita(`Receita ${user.fullName}`)
})