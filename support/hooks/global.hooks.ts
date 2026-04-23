import type { Options } from '@wdio/types'
import { Frameworks } from '@wdio/types';
import fs from 'fs';
import path from 'path';

export const globalBeforeEach = async () => {
    const platform = driver.isAndroid ? 'Android' : 'iOS';
    console.log(`--- [${platform}] Sessão iniciada: ${browser.sessionId} ---`);
};

export const globalAfterEach: Options.Testrunner['afterTest'] = async (
    test,
    context,
    { passed, error }
) => {
    if (!passed) {
        // 1. Define o diretório baseado na plataforma
        const platform = driver.isAndroid ? 'android' : 'ios';
        const dir = path.resolve(process.cwd(), `screenshots/${platform}`);

        // 2. Garante que o diretório existe 
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 3. Limpa o título do teste para virar nome de arquivo (remove espaços e símbolos)
        const cleanTitle = test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = path.join(dir, `FAIL_${cleanTitle}_${timestamp}.png`);

        // 4. Salva o Screenshot
        await browser.saveScreenshot(fileName);
        
        console.error(`❌ Teste falhou [${platform.toUpperCase()}]: ${test.title}`);
        console.log(`Screenshot salvo em: ${fileName}`);
        
        if (error) {
            console.log(`Motivo: ${error.message}`);
        }
    }
};

export const setBSName = async (specs: string[]) => {
  const specName = require('path').basename(specs[0]);
  await browser.execute(`browserstack_executor: ${JSON.stringify({
    action: 'setSessionName',
    arguments: { name: specName }
  })}`);
};

export const setBSTestAnnotation = async (test: Frameworks.Test) => {
  const message = `▶️ Início: ${test.title}`;
  console.log(message);

  await browser.execute(`browserstack_executor: ${JSON.stringify({
    action: 'annotate',
    arguments: {
      data: message,
      level: 'info'
    }
  })}`)
};

export const setBSTestResult = async (
  test: Frameworks.Test,
  context: any,
  { error, passed }: Frameworks.TestResult
) => {
  const message = passed
    ? `✅ Sucesso: ${test.title}`
    : `❌ Falha: ${test.title} - ${error?.message}`;

  console.log(message);

  await browser.execute(`browserstack_executor: ${JSON.stringify({
    action: 'annotate',
    arguments: {
      data: message,
      level: passed ? 'info' : 'error'
    }
  })}`);

  await browser.execute(`browserstack_executor: ${JSON.stringify({
    action: 'setSessionStatus',
    arguments: {
      status: passed ? 'passed' : 'failed',
      reason: passed ? 'Teste finalizado com sucesso!' : error?.message
    }
  })}`)
};