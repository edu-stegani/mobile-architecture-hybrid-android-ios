import { users } from '../../support/data/users.js'
import { loginScreen, dashboardScreen, receitaScreen } from '../../screens/index.js'

const data = users.ctMilenar

describe('Consultar receitas no card', () => {

    before(async () => {
        await loginScreen.login(data.cpf, data.senha)
        await dashboardScreen.checkDashboard()
    })

    it('deve visualizar receitas cadastradas', async () => {
        await dashboardScreen.tapCardByText('CADASTRAR RECEITA')
        await receitaScreen.checkReceita(`Receita ${data.fullName}`)
    })

    it('deve visualizar a imagem da receita', async () => {
        await receitaScreen.clickSeletorRecipe(`Receita ${data.fullName}`, 'image')
        await receitaScreen.closeRecipeModal()
    })

    it('deve enviar nova receita', async () => {
        await receitaScreen.sendNewRecipe(data.fullName , 'Médica (CRM)', 'SP', 'DIPIRONA')
    })

})