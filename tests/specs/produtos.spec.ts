import data from '../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../support/utils/appHelper.js'
import { homeScreen, benefitsScreen, buscarMedicamentoScreen } from '../../screens/index.js'
import { before } from 'node:test';
import postgresHelper from '../../support/utils/postgresHelper.js';

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)
})

beforeEach(async () => {
    await AppHelper.login(user.cpf, user.password);
});

describe('Buscar Produtos', () => {

    it('realizar a busca de um produto', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await buscarMedicamentoScreen.searchProduct('BUSCOPAN')
        await buscarMedicamentoScreen.viewProductDetails('1', 'BUSCOPAN')
        await buscarMedicamentoScreen.viewProductDetails('2', 'BUSCOPAN')
    })

    it('selecionar produto e filtrar farmácias por menor preço', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await buscarMedicamentoScreen.searchProduct('BUSCOPAN')
        await buscarMedicamentoScreen.selectProductAndFilterByOption('Menor Preço')
    })

    it('selecionar produto e filtrar farmácias por distância', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await buscarMedicamentoScreen.searchProduct('BUSCOPAN')
        await buscarMedicamentoScreen.selectProductAndFilterByOption('Distância')
    })

    it('selecionar produto e filtrar farmácias por avaliação', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await buscarMedicamentoScreen.searchProduct('BUSCOPAN')
        await buscarMedicamentoScreen.selectProductAndFilterByOption('Avaliação')
    })

})