import data from '../../support/data/users.json' with { type: 'json' };
import { AppHelper } from '../../support/utils/appHelper.js'
import { homeScreen, benefitsScreen, produtosScreen } from '../../screens/index.js'
import postgresHelper from '../../support/utils/postgresHelper.js';

const user = data.users.Eduardo

before(async () => {
    await postgresHelper.updatePasswordForStrong(user.cpf)

    await driver.setGeoLocation({
            latitude: -23.615799,
            longitude: -46.570010,
        });
})

beforeEach(async () => {
    await AppHelper.login(user.cpf, user.password);
});

describe('Buscar Produtos', () => {

    it('realizar a busca de um produto', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await produtosScreen.searchProduct('BUSCOPAN')
        await produtosScreen.viewProductDetails('1', 'BUSCOPAN')
        await produtosScreen.viewProductDetails('2', 'BUSCOPAN')
    })

    it('selecionar produto e filtrar farmácias por menor preço', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await produtosScreen.searchProduct('BUSCOPAN')
        await produtosScreen.selectProductAndFilterByOption('Menor Preço')
    })

    it('selecionar produto e filtrar farmácias por distância', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await produtosScreen.searchProduct('BUSCOPAN')
        await produtosScreen.selectProductAndFilterByOption('Distância')
    })

    it('selecionar produto e filtrar farmácias por avaliação', async () => {
        await homeScreen.tapPilarByName('Med')
        await benefitsScreen.clickLinkByText('Busca de Produtos')
        await produtosScreen.searchProduct('BUSCOPAN')
        await produtosScreen.selectProductAndFilterByOption('Avaliação')
    })

})