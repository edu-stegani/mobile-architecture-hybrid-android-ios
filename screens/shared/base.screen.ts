import { ChainablePromiseElement } from 'webdriverio'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class BaseScreen {
    async waitAndClick(element: ChainablePromiseElement) {
        await element.waitForDisplayed({ timeout: 15000 })
        await element.waitForEnabled()
        await element.click()
    }

    async hideKeyboard() {
        const ok = `-ios predicate string:name ==[c] "ok_toolbar"`;
        await this.waitAndClick($(ok));
    }

    async scrollToElement(selector: string, maxRetries = 10) {
        for (let i = 0; i < maxRetries; i++) {
            await driver.pause(1000);
            const el = await $(selector);
            if (await el.isExisting()) {
                if (await el.isDisplayed()) {
                    console.log(`Elemento encontrado e visível no scroll ${i}`);
                    return; // PARA o loop aqui
                }
            }
            console.log(`Elemento não visível, tentando swipe ${i + 1}...`);
            await this.performSwipeUp();
        }
        throw new Error(`Elemento não encontrado: ${selector}`);
    }

    private async performSwipeUp() {
        const size = await driver.getWindowRect();
        const centerX = size.width / 2;
        const startY = size.height * 0.7;
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

    async uploadImageFromProject() {
        const localFilePath = path.resolve(__dirname, '../../support/image/recipe.jpg');
        const data = fs.readFileSync(localFilePath).toString('base64');

        const caps = driver.capabilities as any;
        const isBrowserStack = caps['bstack:options'] || caps['browserstack.user'];

        if (driver.isAndroid) {
            if (isBrowserStack) {
                console.log(`[Android BrowserStack] device bstack já tem midia...`);
            } else {
                const devicePath = '/sdcard/Download/recipe.jpg';
                await driver.pushFile(devicePath, data);
                console.log(`[Android Local] Arquivo enviado para dispositivo: ${devicePath}`);
            }
        } else {
            if (isBrowserStack) {
                console.log(`[iOS BrowserStack] device bstack já tem midia...`);
            } else {
                console.log(`[iOS Local] Executando localmente no Simulador...`);
                await driver.execute('mobile: addMedia', { path: localFilePath });
            }
        }
    }

    async waitAndSetValue(element: ChainablePromiseElement, value: string) {
        await element.waitForDisplayed()
        await element.setValue(value)
    }

    async checkpointScreen(textCheckpoint: string) {
        const selector = process.env.PLATFORM === 'ios'
            ? `//*[@label='${textCheckpoint}']`
            : `//*[@text='${textCheckpoint}']`;

        const checkpointText = $(selector);
        await checkpointText.waitForDisplayed({ timeout: 20000, timeoutMsg: `Checkpoint "${textCheckpoint}" não encontrado` });
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
