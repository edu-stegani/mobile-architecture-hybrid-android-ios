import { users } from '../../support/data/users.js'
import { loginScreen, homeScreen, receitaScreen, benefitsScreen } from '../../screens/index.js'
import oracleHelpers from 'support/utils/oracleHelpers.js'

const data = users.ctVidalink

describe('cadastrar receitas', () => {

    before(async () => {
        await oracleHelpers.acceptTermAndConditions(data.cpf)
        await loginScreen.login(data.cpf, data.senha)
        await homeScreen.checkDashboard()
    })

    it('enviar nova receita para titular', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Cadastrar receitas')
        await receitaScreen.sendNewRecipe(data.fullName, 'Médica (CRM)', 'MG', 'DIPIRONA')
    })

    it('consultar receitas cadastradas', async () => {
        await receitaScreen.checkReceita(`Receita ${data.fullName}`)
    })

    it('consultar imagem da receita', async () => {
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'image')
        await receitaScreen.closeRecipeModal()
    })

    it('consultar detalhes da receita', async () => {
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'details')
        await receitaScreen.viewDetailsRecipe()
    })

    it('excluir a receita', async () => {
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'delete')
        await receitaScreen.deleteRecipe()
    })

})