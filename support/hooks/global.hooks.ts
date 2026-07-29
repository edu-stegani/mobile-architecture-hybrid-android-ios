import type { Options } from '@wdio/types'
import { Frameworks } from '@wdio/types';
import fs from 'fs';
import path from 'path';
import allure from '@wdio/allure-reporter'

export const globalBeforeEach = async () => {
  const platform = driver.isAndroid ? 'Android' : 'iOS';
  console.log(`--- [${platform}] Sessão iniciada: ${browser.sessionId} ---`);
};

export const globalAfterEach: Options.Testrunner['afterTest'] = async (
  test,
  context,
  { error, passed }
) => {
  const message = passed
    ? `✅ Sucesso: ${test.title}`
    : `❌ Falha: ${test.title}`;

  console.log(message);

  if (error) {
    console.log(`Motivo: ${error.message}`);
  }

  // Tira screenshot em ambos os casos (sucesso e falha)
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`Screenshot - ${passed ? 'SUCESSO' : 'FALHA'}`, Buffer.from(screenshot, 'base64'), 'image/png');

  // Salva o screenshot em um arquivo apenas em caso de falha para fácil acesso
  if (!passed) {
    const platform = driver.isAndroid ? 'android' : 'ios';
    const dir = path.resolve(process.cwd(), `screenshots/${platform}`);
    fs.mkdirSync(dir, { recursive: true });
    const cleanTitle = test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.join(dir, `FAIL_${cleanTitle}_${timestamp}.png`);
    await browser.saveScreenshot(fileName);
    console.log(`Screenshot salvo em: ${fileName}`);
  }
};

export const setBSSessionName = async (testTitle: string) => {
  await browser.execute(`browserstack_executor: ${JSON.stringify({
    action: 'setSessionName',
    arguments: { name: testTitle }
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