import data from '../../../support/data/users.json' with { type: 'json' };
import { homeScreen, benefitsScreen } from '../../../screens/index.js'
import postgresHelper from '../../../support/utils/postgresHelper.js'
import oracleHelpers from '../../../support/utils/oracleHelpers.js'
import { AppHelper } from '../../../support/utils/appHelper.js'

const userNestle = data.users.Roberto

before(async () => {
    await postgresHelper.updateRecognitionFace('NO_FACE', userNestle.CT)
    await postgresHelper.removeLinkTutorialWithCT('2', userNestle.CT)
    await postgresHelper.updatePasswordForStrong(userNestle.cpf)
    await oracleHelpers.acceptTermAndConditions(userNestle.cpf)

    await AppHelper.login(userNestle.cpf, userNestle.password);
})

it('Usuário com apenas pilar Med', async () => {
    await homeScreen.onlyOnePillarOn360('Med')
    await homeScreen.tapPilarByName('Med')

    await benefitsScreen.viewLinkByText('Cadastrar receitas')
    await benefitsScreen.viewLinkByText('Histórico de receitas')
    await benefitsScreen.viewLinkByText('Reembolso')
    await benefitsScreen.viewLinkByText('Rede Credenciada')
    await benefitsScreen.viewLinkByText('Rede online')
    await benefitsScreen.viewLinkByText('Produtos')
})