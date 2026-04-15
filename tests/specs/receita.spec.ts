import data from '../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, receitaScreen, benefitsScreen } from '../../screens/index.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'
import { flowSendRecipe } from '../../support/utils/apiHelpers.js'

const user = data.users.Eduardo;

before(async () => {
    await flowSendRecipe(user);
    await oracleHelpers.acceptTermAndConditions(user.cpf)
})

beforeEach(async () => {
    const appId = driver.isAndroid ? 'com.astl.vidalink.beta' : 'br.com.vidalink.beta';
    try { await driver.terminateApp(appId); } catch (e) { }
    await driver.activateApp(appId);

    await loginScreen.login(user.cpf, user.password)
    await homeScreen.checkDashboard()
})

describe('cadastrar receitas', () => {

    it('enviar nova receita para titular', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Cadastrar receitas')
        await receitaScreen.sendNewRecipe(user.fullName, 'Médica (CRM)', 'MG', 'DIPIRONA')
    })

    it('consultar receitas cadastradas', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${user.fullName}`)
    })

    it('consultar imagem da receita', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${user.fullName}`)
        await receitaScreen.clickSeletorRecipe(`Receita ${user.fullName}`, 'image')
        await receitaScreen.closeRecipeModal()
    })

    it('consultar detalhes da receita', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${user.fullName}`)
        await receitaScreen.clickSeletorRecipe(`Receita ${user.fullName}`, 'details')
        await receitaScreen.viewDetailsRecipe()
    })

    it('excluir a receita', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${user.fullName}`)
        await receitaScreen.clickSeletorRecipe(`Receita ${user.fullName}`, 'delete')
        await receitaScreen.deleteRecipe()
    })

})