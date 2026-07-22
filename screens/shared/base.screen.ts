import { ChainablePromiseElement } from 'webdriverio'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class BaseScreen {
    // LOCATORS ANDROID
    get btnDeleteAndroid() {
        return $('id:com.astl.vidalink.beta:id/btDeleteRecipe')
    }

    get btnDeletePictureAndroid() {
        return $('id:com.astl.vidalink.beta:id/btDeletePicture')
    }

    get btnConfirmPopUp() {
        return $(`id:com.astl.vidalink.beta:id/btConfirm`)
    }

    get tollbar() {
        return '//android.view.ViewGroup[@resource-id="com.astl.vidalink.beta:id/toolbar"]'
    }

    get btnSkipAndroid() {
        return $('//android.widget.Button[@text="SKIP"]')
    }

    get placeCardAndroid() {
        return `//*[@resource-id="com.google.android.apps.maps:id/business_place_card"]`
    }

    // LOCATORS IOS
    get btnDeleteIOS() {
        return $('~ic delete')
    }

    get btnDeletePictureIOS() {
        return $('~ic trash')
    }

    get btnProximoIOS() {
        return $('//XCUIElementTypeButton[@name="Próximo"]')
    }

    // METHODS
    async waitAndClick(elementOrSelector: ChainablePromiseElement | string) {
        const element = typeof elementOrSelector === 'string' ? $(elementOrSelector) : elementOrSelector;
        await element.waitForDisplayed({ timeout: 15000, interval: 1000 });
        await element.click();
    }

    async hideKeyboard() {
        const ok = `-ios predicate string:name ==[c] "ok_toolbar"`;
        await this.waitAndClick($(ok));
    }

    async scrollToElement(elementOrSelector: ChainablePromiseElement | string, maxRetries = 15) {
        const el = typeof elementOrSelector === 'string' ? $(elementOrSelector) : elementOrSelector;

        for (let i = 0; i < maxRetries; i++) {
            const isVisible = await el.waitUntil(async () => {
                return (await el.isDisplayed());
            }, { timeout: 1000, interval: 100 }).catch(() => false);

            if (isVisible) return;

            console.log(`Tentando swipe ${i + 1}...`);
            await this.performSwipeUp();
        }
        throw new Error(`Elemento não encontrado: ${elementOrSelector.toString()}`);
    }

    async SwipeLeftCoordinates(coordinateY: number) {
        const size = await driver.getWindowRect();

        const startX = size.width * 0.8;
        const endX = size.width * 0.1;

        const centerY = coordinateY; // Coordenada Y fixa para o swipe 

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 1000, x: startX, y: centerY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 1000},
                { type: 'pointerMove', duration: 1000, origin: 'viewport', x: endX, y: centerY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.pause(600);
    }

    async SwipeRightCoordinates(coordinateY: number) {
        const size = await driver.getWindowRect();

        const startX = size.width * 0.2;
        const endX = size.width * 0.9;

        const centerY = coordinateY; // Coordenada Y fixa para o swipe 

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: centerY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 1000},
                { type: 'pointerMove', duration: 1000, origin: 'viewport', x: endX, y: centerY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.pause(600);
    }

    private async performSwipeUp() {
        const size = await driver.getWindowRect();
        const centerX = size.width / 2;
        const startY = size.height * 0.6;
        const endY = size.height * 0.2;

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 600, origin: 'viewport', x: centerX, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.pause(500);
    }

    async uploadImageFromProject(imageJPG: string) {
        const localFilePath = path.resolve(__dirname, `../../support/image/${imageJPG}`);
        const data = fs.readFileSync(localFilePath).toString('base64');

        const caps = driver.capabilities as any;
        const isBrowserStack = caps['bstack:options'] || caps['browserstack.user'];

        if (driver.isAndroid) {
            if (isBrowserStack) {
                console.log(`[Android BrowserStack] device bstack já tem midia...`);
            } else {
                const devicePath = '/sdcard/Download/image.jpg';
                await driver.pushFile(devicePath, data);
                console.log(`[Android Local] Arquivo enviado para dispositivo: ${devicePath}`);
            }
        } else {
            console.log(`[iOS] device já tem midia...`);
        }
    }

    async getPhotoElement(): Promise<ChainablePromiseElement> {
        // === ANDROID ===
        if (driver.isAndroid) {
            return $('android=new UiSelector().descriptionStartsWith("Photo taken on").instance(0)');
        }

        // === IOS ===
        const selectorSim = '(//XCUIElementTypeOther[@name="PXZoomablePhotosLayout-Group"]//XCUIElementTypeImage)[1]';
        const selectorBS = '-ios class chain:**/XCUIElementTypeImage[`name BEGINSWITH "Photo"`][1]';

        await browser.waitUntil(async () => {
            return (await $(selectorSim).isExisting()) || (await $(selectorBS).isExisting());
        }, { timeout: 15000 });

        if (await $(selectorSim).isExisting()) {
            // console.log("Ambiente detectado: Simulador");
            return $(selectorSim);
        }

        // console.log("Ambiente detectado: BrowserStack");
        return $(selectorBS);
    }

    async addPhoto(imageJPG: string) {
        await this.uploadImageFromProject(imageJPG)

        if (await driver.isKeyboardShown()) {
            await driver.back();
        }

        const btnAddImageSelector = driver.isIOS
            ? $(`(//XCUIElementTypeTextField/../../..//XCUIElementTypeButton)[2]`)
            : $(`id:com.astl.vidalink.beta:id/text_input_end_icon`);
        await this.waitAndClick(btnAddImageSelector)

        const btnGaleryPhotos = driver.isIOS
            ? $(`(//XCUIElementTypeStaticText//../../XCUIElementTypeCell)[2]`)
            : $(`id:com.astl.vidalink.beta:id/tvSecondOption`);
        await this.waitAndClick(btnGaleryPhotos)

        const photo = await this.getPhotoElement()
        await photo.click()

        const btnDone = driver.isIOS
            ? $('//XCUIElementTypeButton[@label="Done"]')
            : $('//android.widget.TextView[@text="Done"]');
        if (await btnDone.isDisplayed()) {
            await this.waitAndClick(btnDone)
        }

        const btnDeletePicture = driver.isIOS
            ? this.btnDeletePictureIOS
            : this.btnDeletePictureAndroid;
        await btnDeletePicture.waitForDisplayed()

    }

    async waitAndSetValue(element: ChainablePromiseElement, value: string) {
        await element.waitForDisplayed({ timeout: 10000 })
        await element.setValue(value)
    }

    async checkpointScreen(textCheckpoint: string) {
        const selector = process.env.PLATFORM === 'ios'
            ? `//*[contains(@label, '${textCheckpoint}')]`
            : `//*[contains(@text, '${textCheckpoint}')]`;

        const checkpointText = $(selector);
        await checkpointText.waitForDisplayed({ timeout: 15000, interval:1000, timeoutMsg: `Checkpoint "${textCheckpoint}" não encontrado` });
    }

    async back() {
        const backIcon = process.env.PLATFORM === 'ios'
            ? `~navBarBackButtonIdentifier`
            : `//android.widget.ImageButton`;
        await this.waitAndClick($(`${backIcon}`))
    }

    async acceptPermissionAlertLocation() {
        const btnAllow = $('//XCUIElementTypeButton[@name="Allow While Using App"]')
        try {
            await this.waitAndClick(btnAllow)
        } catch (e) { }
    }

    async acceptNotifications() {
        const btnAllow = $('//XCUIElementTypeButton[@name="Allow"]')
        try {
            await this.waitAndClick(btnAllow)
        } catch (e) { }
    }

    async acceptFullAccessGalery() {
        const btnAllow = $('//XCUIElementTypeButton[@name="Allow Full Access"]')
        try {
            await this.waitAndClick(btnAllow)
        } catch (e) { }
    }

    async selectPickerValue(value: string) {
        const picker = await $('-ios predicate string:type == "XCUIElementTypePickerWheel"');
        await picker.waitForDisplayed({ timeout: 5000 });
        await picker.click();
        await picker.setValue(value);
        await picker.click();
    }
}
