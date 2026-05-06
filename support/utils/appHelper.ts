import { loginScreen, homeScreen, profileScreen } from '../../screens/index.js'
import { only } from 'node:test';

export class AppHelper {
    static async resetAndLogin(cpf: string, password: string ) {
        const appId = driver.isAndroid 
            ? 'com.astl.vidalink.beta' 
            : 'br.com.vidalink.beta';

        try { await driver.terminateApp(appId);  } catch (e) { }
        await driver.activateApp(appId);

        await loginScreen.login(cpf, password);
        await homeScreen.checkDashboard();
    }
}