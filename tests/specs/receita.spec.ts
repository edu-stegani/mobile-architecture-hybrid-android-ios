import { users } from '../../support/data/users.js'
import { loginScreen, homeScreen, receitaScreen, benefitsScreen } from '../../screens/index.js'
import oracleHelpers from 'support/utils/oracleHelpers.js'

const data = users.ctMilenar

beforeEach(async () => {
    await driver.terminateApp('br.com.vidalink.beta');
    await driver.activateApp('br.com.vidalink.beta');

    await oracleHelpers.acceptTermAndConditions(data.cpf)   //pré condição 

    await loginScreen.login(data.cpf, data.senha)
    await homeScreen.checkDashboard()
})

describe('cadastrar receitas', () => {

    it('enviar nova receita para titular', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Cadastrar receitas')
        await receitaScreen.sendNewRecipe(data.fullName, 'Médica (CRM)', 'MG', 'DIPIRONA')
    })

    it('consultar receitas cadastradas', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${data.fullName}`)
    })

    it('consultar imagem da receita', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${data.fullName}`)
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'image')
        await receitaScreen.closeRecipeModal()
    })

    it('consultar detalhes da receita', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${data.fullName}`)
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'details')
        await receitaScreen.viewDetailsRecipe()
    })

    it('excluir a receita', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Histórico de receitas')
        await receitaScreen.checkReceita(`Receita ${data.fullName}`)
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'delete')
        await receitaScreen.deleteRecipe()
    })

})