import { users } from '../../support/data/users.js'
import { loginScreen, dashboardScreen } from '../../screens/index.js'

describe('Login no aplicativo', () => {

  it('deve fazer login com sucesso', async () => {

    const data = users.ctVidalink

    await loginScreen.login( data.cpf, data.senha )
    await loginScreen.fillMatricula(data.matricula)

    await dashboardScreen.checkDashboard()
 
  })

})