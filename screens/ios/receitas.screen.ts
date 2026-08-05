import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

const RecipeLocators = {
    basePath: (name: string) => `//XCUIElementTypeCell//XCUIElementTypeStaticText[@name="${name}"]`,
    ids: {
        image: 'XCUIElementTypeButton[@name="ic photo receita"]',
        delete: 'XCUIElementTypeButton[@name="ic trash"]',
        status: 'XCUIElementTypeStaticText[7]',
        details: 'XCUIElementTypeStaticText[contains(@name, "Detalhes por itens")]'
    }
};

class ReceitaIOS extends BaseScreen {

    // ====== SELECTORS ======
    get tollbarMyRecipes() {
        return $(`~Minhas receitas`)
    }

    get btnCloseRecipeModal() {
        return $('~ic little close');
    }

    get btnNewRecipe() {
        return $('~submitNewReceiptButtonIdentifier')
    }

    get btnAddImage() {
        return $('(//XCUIElementTypeButton[@label="ic prescription add"]//../../../..//XCUIElementTypeButton)[2]')  //(//XCUIElementTypeButton)[4]
    }

    get btnGaleryPhotos() {
        return $('//XCUIElementTypeStaticText[@name="Galeria de Fotos"]/../XCUIElementTypeOther')
    }

    get btnFinish() {
        return $('//XCUIElementTypeButton[@label="Finalizar"]')
    }

    get btnDeleteSim() {
        return $('~primaryButtonIdentifier')
    }

    get inputRecipeName() {
        return $('//XCUIElementTypeTextField[@value="Nome da receita"]')
    }

    get inputCRM() {
        return $('//XCUIElementTypeStaticText[@name="Número do conselho"]/..//XCUIElementTypeTextField')
    }

    get inputDate() {
        return $('//XCUIElementTypeTextField[@value="dd/mm/aaaa"]')
    }

    get inputMedicineName() {
        return $('//XCUIElementTypeTextField[@value="Insira o nome do medicamento"]')
    }

    get selectTypeRecipe() {
        return $('//XCUIElementTypeTextField[@value="Selecione o tipo"]')
    }

    get selectState() {
        return $('//XCUIElementTypeTextField[@value="Selecione a UF"]')
    }

    // ======== ACTIONS ========
    async viewRecipes() {
        await this.tollbarMyRecipes.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    async checkRecipeElements(recipeName: string) {
        const base = RecipeLocators.basePath(recipeName);

        const elements = {
            title: $(`(${base})[1]`),
            image: $(`(${base}/../${RecipeLocators.ids.image})[1]`),
            delete: $(`(${base}/../${RecipeLocators.ids.delete})[1]`),
            status: $(`(${base}/../${RecipeLocators.ids.status})[1]`),
            details: $(`(${base}/../${RecipeLocators.ids.details})[1]`)
        };

        for (const el of Object.values(elements)) {
            await el.waitForDisplayed({ timeout: 15000 });
        }
    }

    async selectUserAndGiveNameRecipe(fullNname: string) {
        const selectUser = $(`//XCUIElementTypeStaticText[contains(@value, '${fullNname}')]/../XCUIElementTypeButton[@label="ic prescription radio unselect"]`)
        try {
            await this.waitAndClick(selectUser)
        } catch (e) { }

        await this.waitAndSetValue(this.inputRecipeName, `Receita ${fullNname}`)
        await this.hideKeyboard()
        await this.waitAndClick(this.btnProximoIOS)
    }

    async addPhotoRecipe() {
        await this.checkpointScreen('Envie um ou mais arquivos da sua receita médica.')
        await this.addPhoto('recipe.jpg')
        this.waitAndClick(this.btnProximoIOS)
    }

    async getYesterdayDate() {
        const date = new Date();
        // Subtrai 1 dia da data atual
        date.setDate(date.getDate() - 1);

        // Formata com zero à esquerda se necessário
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const year = date.getFullYear();

        return `${day}${month}${year}`; // Retornamos apenas números para o sendKeys
    }

    async fillDataRecipe(typeRecipe: string, uf: string) {
        await this.checkpointScreen('Informe os dados da receita');

        // --- Tipo de Receita ---
        await this.waitAndClick(this.selectTypeRecipe);
        await this.selectPickerValue(typeRecipe);
        await this.hideKeyboard();

        // --- CRM ---
        await this.waitAndClick(this.inputCRM);
        await this.inputCRM.addValue('123456');
        await this.hideKeyboard();

        // --- UF ---
        await this.waitAndClick(this.selectState);
        await this.selectPickerValue(uf);
        await this.hideKeyboard();

        // --- Data ---
        const yesterday = await this.getYesterdayDate();
        await this.inputDate.addValue(yesterday);
        await this.hideKeyboard();

        await this.waitAndClick(this.btnProximoIOS);
    }

    async fillAndSelectMedicine(medicineName: string) {
        await this.checkpointScreen('Quais medicamentos estão na receita?')
        await this.waitAndSetValue(this.inputMedicineName, `${medicineName}`)

        // aguarda lista aparecer
        const lista = $('-ios predicate string:type == "XCUIElementTypeTable"');
        await lista.waitForDisplayed({ timeout: 5000 });

        // busca item com match exato
        const item = $(`-ios predicate string:type == "XCUIElementTypeStaticText" AND name == "${medicineName}"`);
        await this.waitAndClick(item);
        await this.hideKeyboard();
        await this.btnDeletePictureIOS.waitForDisplayed()
        await this.waitAndClick(this.btnProximoIOS)
    }

    // ======== METHODS ========
    async checkReceita(recipeName: string) {
        await this.viewRecipes()
        await this.checkRecipeElements(recipeName)
    }

    async clickSeletorRecipe(recipeName: string, selector: 'image' | 'delete' | 'status' | 'details') {
        const base = RecipeLocators.basePath(recipeName);

        const elements = {
            title: $(`(${base})[1]`),
            image: $(`(${base}/../${RecipeLocators.ids.image})[1]`),
            delete: $(`(${base}/../${RecipeLocators.ids.delete})[1]`),
            status: $(`(${base}/../${RecipeLocators.ids.status})[1]`),
            details: $(`(${base}/../${RecipeLocators.ids.details})[1]`)
        };
        const targetSelector = elements[selector]
        await this.waitAndClick(targetSelector)
    }

    async closeRecipeModal() {
        const closeIcon = await this.btnCloseRecipeModal;
        await this.waitAndClick(closeIcon)
    }

    async sendNewRecipe(fullNname: string, typeRecipe: string, uf: string, medicine: string) {
        // Screen Informe nome para receita
        await this.selectUserAndGiveNameRecipe(fullNname)
        // Screen anexar foto da receita
        await this.addPhotoRecipe()
        // Screen informe os dados da receita
        await this.fillDataRecipe(typeRecipe, uf)
        // Screen quais medicamentos 
        await this.fillAndSelectMedicine(medicine)
        // // Screen receita enviada
        await this.checkpointScreen('Receita enviada!')
        await this.waitAndClick(this.btnFinish)
        await this.btnFinish.waitForDisplayed({reverse: true})
    }

    async viewDetailsRecipe() {
        // await this.checkpointScreen('Itens da receita')
        await this.btnDeletePictureIOS.waitForDisplayed()
        await this.back()
    }

    async deleteRecipe() {
        await this.checkpointScreen('Tem certeza que deseja apagar essa receita?')
        await this.waitAndClick(this.btnDeleteSim)
        await this.btnNewRecipe.waitForDisplayed()
    }
}

export default new ReceitaIOS()