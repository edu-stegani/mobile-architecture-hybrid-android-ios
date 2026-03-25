import { users } from '../../support/data/users.js'
import { loginScreen, homeScreen, receitaScreen } from '../../screens/index.js'

const data = users.ctMilenar

describe('cadastrar receitas', () => {

    before(async () => {
        await loginScreen.login(data.cpf, data.senha)
        await homeScreen.checkDashboard()
    })

    // it(' enviar nova receita', async () => {
    //     await homeScreen.tapCardByText('CADASTRAR RECEITA')
    //     await receitaScreen.sendNewRecipe(data.fullName , 'Médica (CRM)', 'MG', 'DIPIRONA')
    // })

    it('consultar receitas cadastradas', async () => {
        await homeScreen.tapCardByText('CADASTRAR RECEITA')
        // await receitaScreen.checkReceita(`Receita ${data.fullName}`)
    })

    // it('consultar imagem da receita', async () => {
    //     await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'image')
    //     await receitaScreen.closeRecipeModal()
    // })

    // it('consultar detalhes da receita', async () => {
    //     await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'details')
    //     await receitaScreen.viewDetailsRecipe()
    // })

    // it('excluir a receita', async () => {
    //     await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'delete')
    //     await receitaScreen.deleteRecipe()
    // })

})