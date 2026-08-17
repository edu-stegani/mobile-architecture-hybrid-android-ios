import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import { only } from 'node:test';

export class AppHelper {
    static async resetApp() {
        const appId = driver.isAndroid 
            ? 'com.astl.app-beta-exemplo.beta' 
            : 'br.com.app-beta-exemplo.beta';

        try { await driver.terminateApp(appId);  } catch (e) { }
        await driver.activateApp(appId);
    }

    static async login(cpf: string, password: string ) {
        await this.resetApp();
        await loginScreen.login(cpf, password);
        await homeScreen.checkDashboard();
    }   

    static async loginKeepConnected(cpf: string, password: string ) {
        await this.resetApp();
        await loginScreen.loginKeepConnected(cpf, password);
        await homeScreen.checkDashboard();
    }   
    
}