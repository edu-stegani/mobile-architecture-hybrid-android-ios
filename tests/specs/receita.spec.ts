import data from '../../support/data/users.json' with { type: 'json' };
import { loginScreen, homeScreen, receitaScreen, benefitsScreen } from '../../screens/index.js'
import oracleHelpers from '../../support/utils/oracleHelpers.js'

const user = data.users.William

beforeEach(async () => {
    await driver.terminateApp('br.com.vidalink.beta');
    await driver.activateApp('br.com.vidalink.beta');

    await oracleHelpers.acceptTermAndConditions(user.cpf)   //pré condição 

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