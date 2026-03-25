import { ChainablePromiseElement } from 'webdriverio'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class BaseScreen {
    async waitAndClick(element: ChainablePromiseElement) {
        await element.waitForDisplayed()
        await element.waitForEnabled()
        await element.click()
    }

    async hideKeyboard() {
        await this.waitAndClick($('~OK_toolbar'))
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
        // Caminho da imagem no projeto
        const localFilePath = path.resolve(__dirname, '../../support/image/recipe.jpg');

        // Caminho de destino no dispositivo
        const devicePath = '/sdcard/Download/recipe.jpg';

        const data = fs.readFileSync(localFilePath).toString('base64');
        await driver.pushFile(devicePath, data);
        console.log(`Arquivo enviado para: ${devicePath}`);
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
        await checkpointText.waitForDisplayed()
    }

    async acceptPermissionAlertLocation() {
        try {
            const btnAllowAlert = $('//XCUIElementTypeButton[@name="Allow While Using App"]')
            // Aguarda até 10 segundos por qualquer alerta do sistema
            await btnAllowAlert.waitForDisplayed({
                timeout: 10000,
                timeoutMsg: 'Alerta não apareceu, seguindo...'
            });
            await btnAllowAlert.click()
        } catch (e) {
            // Se não houver alerta, ele apenas ignora e segue
        }
    }
}