import { $ } from '@wdio/globals'
import BaseScreen from '../shared/base.screen.js'

const RecipeLocators = {
    basePath: (name: string) => `//android.widget.TextView[@text="${name}"]/..`,
    ids: {
        image: 'com.astl.vidalink.beta:id/ivAction1',
        delete: 'com.astl.vidalink.beta:id/ivAction2',
        status: 'com.astl.vidalink.beta:id/tvPrescriptionStatus',
        details: 'com.astl.vidalink.beta:id/tvPrescriptionDetails'
    }
};

const DetailsLocators = {
    baseXpath: '//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/clContent"]',
    ids: {
        data: 'com.astl.vidalink.beta:id/viewPrescriptionData',
        iconRemove: 'com.astl.vidalink.beta:id/ivAction1'
    }
}

class ReceitaIOS extends BaseScreen {

    // ====== SELECTORS ======
    get tollbarMyRecipes() {
        return $(`//android.widget.TextView[@text="Minhas receitas"]`)
    }

    get btnCloseRecipeModal() {
        return $('id:com.astl.vidalink.beta:id/ivCloseButton');
    }

    get btnNewRecipe() {
        return $('id:com.astl.vidalink.beta:id/btSendNewRecipe')
    }

    get btnConfirmar() {
        return $('id:com.astl.vidalink.beta:id/btNext')
    }

    get btnAddImage() {
        return $('id:com.astl.vidalink.beta:id/text_input_end_icon')
    }

    get btnGaleryPhotos() {
        return $('id:com.astl.vidalink.beta:id/tvSecondOption')
    }

    get btnDeletePicture() {
        return $('id:com.astl.vidalink.beta:id/btDeletePicture')
    }

    get btnDeleteRecipe() {
        return $('id:com.astl.vidalink.beta:id/btDeleteRecipe')
    }

    get btnFinish() {
        return $('id:com.astl.vidalink.beta:id/btnFinish')
    }

    get btnDeleteSim() {
        return $('id:com.astl.vidalink.beta:id/btConfirm')
    }

    get inputRecipeName() {
        return $('id:com.astl.vidalink.beta:id/etRecipeName')
    }

    get inputCRM() {
        return $('id:com.astl.vidalink.beta:id/etRegionalCouncil')
    }

    get inputDate() {
        return $('id:com.astl.vidalink.beta:id/etDate')
    }

    get inputMedicineName() {
        return $('id:com.astl.vidalink.beta:id/etMedicineName')
    }

    get selectTypeRecipe() {
        return $('id:com.astl.vidalink.beta:id/spType')
    }

    get selectState() {
        return $('id:com.astl.vidalink.beta:id/spState')
    }

    // ======== ACTIONS ========
    async viewRecipes() {
        await this.tollbarMyRecipes.waitForDisplayed({ timeout: 30000, interval: 2000 })
    }

    async checkRecipeElements(recipeName: string) {
        const base = RecipeLocators.basePath(recipeName);

        const elements = {
            title: $(`(${base})[1]`),
            image: $(`(${base}//*[@resource-id="${RecipeLocators.ids.image}"])[1]`),
            delete: $(`(${base}//*[@resource-id="${RecipeLocators.ids.delete}"][1])`),
            status: $(`(${base}//*[@resource-id="${RecipeLocators.ids.status}"])[1]`),
            details: $(`(${base}//*[@resource-id="${RecipeLocators.ids.details}"])[1]`)
        };

        for (const el of Object.values(elements)) {
            await el.waitForDisplayed({ timeout: 15000 });
        }
    }

    async selectUser(userName: string) {
        await this.checkpointScreen('Para quem é esta receita?')
        const userSelected = $(`//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/layout"]/*[contains(@text, '${userName}')]`)
        await this.waitAndClick(userSelected)
        await this.waitAndSetValue(this.inputRecipeName, `Receita ${userName}`)
        await this.waitAndClick(this.btnConfirmar)
    }

    async addPhotoRecipe() {
        await this.uploadImageFromProject()
        await this.checkpointScreen('Envie um ou mais arquivos da sua receita médica.')
        await this.waitAndClick(this.btnAddImage)
        await this.waitAndClick(this.btnGaleryPhotos)

        const photo = $('(//android.widget.FrameLayout[@package="com.google.android.photopicker"]//android.view.View[@clickable="true"])[6]');
        await this.waitAndClick(photo)

        const btnDone = $('//android.widget.TextView[@text="Done"]')
        await this.waitAndClick(btnDone)

        await this.btnDeletePicture.waitForDisplayed()
        this.waitAndClick(this.btnConfirmar)
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
        await this.checkpointScreen('Informe os dados da receita')
        await this.waitAndClick(this.selectTypeRecipe)
        const OptionType = $(`//android.widget.FrameLayout//android.widget.CheckedTextView[@package='com.astl.vidalink.beta'][@text='${typeRecipe}']`)
        await this.waitAndClick(OptionType)
        await this.waitAndSetValue(this.inputCRM, '123456')
        await this.waitAndClick(this.selectState)
        const optionState = `//android.widget.FrameLayout//android.widget.CheckedTextView[@text='${uf}']`
        await this.scrollToElement(optionState)
        await this.waitAndClick($(optionState))
        const yesterday = await this.getYesterdayDate();
        await this.waitAndSetValue(this.inputDate, yesterday)
        await this.waitAndClick(this.btnConfirmar)
    }

    async fillAndSelectMedicine(medicineName: string) {
        await this.checkpointScreen('Quais medicamentos estão na receita?')
        await this.waitAndSetValue(this.inputMedicineName, `${medicineName}`)
        const selectMedicine = $(`//android.widget.LinearLayout[@resource-id="com.astl.vidalink.beta:id/llMedicineFilter"]//android.widget.TextView[@text='${medicineName}']`)
        await this.waitAndClick(selectMedicine)
        await this.btnDeleteRecipe.waitForDisplayed()
        await this.waitAndClick(this.btnConfirmar)
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
            image: $(`(${base}//*[@resource-id="${RecipeLocators.ids.image}"])[1]`),
            delete: $(`(${base}//*[@resource-id="${RecipeLocators.ids.delete}"][1])`),
            status: $(`(${base}//*[@resource-id="${RecipeLocators.ids.status}"])[1]`),
            details: $(`(${base}//*[@resource-id="${RecipeLocators.ids.details}"])[1]`)
        };
        const targetSelector = elements[selector]
        await this.waitAndClick(targetSelector)
    }

    async closeRecipeModal() {
        const closeIcon = await this.btnCloseRecipeModal;
        await this.waitAndClick(closeIcon)
    }

    async sendNewRecipe(fullName: string, typeRecipe: string, uf: string, medicine: string) {
        await this.waitAndClick(this.btnNewRecipe)
        // Screen para quem é a receita
        await this.selectUser(fullName)
        // Screen anexar foto da receita
        await this.addPhotoRecipe()
        // Screen informe os dados da receita
        await this.fillDataRecipe(typeRecipe, uf)
        // Screen quais medicamentos 
        await this.fillAndSelectMedicine(medicine)
        // Screen receita enviada
        await this.checkpointScreen('Receita enviada!')
        await this.waitAndClick(this.btnFinish)
        // Screen Minhas receitas
        await this.tollbarMyRecipes.waitForDisplayed()
    }

    async viewDetailsRecipe() {
        await this.checkpointScreen('Itens da receita')
        const base = DetailsLocators.baseXpath;
        const elements = {
            data: $(`${base}//*[@resource-id="${DetailsLocators.ids.data}"]`),
            iconRemove: $(`${base}//*[@resource-id="${DetailsLocators.ids.iconRemove}"]`),
        };
        for (const el of Object.values(elements)) {
            await el.waitForDisplayed({ timeout: 15000 });
        }
        await this.waitAndClick($('//android.widget.ImageButton'))
    }

    async deleteRecipe() {
        await this.checkpointScreen('Tem certeza que deseja apagar essa receita?')
        await this.waitAndClick(this.btnDeleteSim)
        await this.checkpointScreen('Você ainda não enviou nenhuma receita')
    }
}

export default new ReceitaIOS()