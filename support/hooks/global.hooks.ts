import type { Options } from '@wdio/types'

export const globalBeforeEach = async () => {
    const packageName = 'com.astl.vidalink.beta'
    
    await driver.terminateApp(packageName)
    
    console.log('Sessão iniciada:', browser.sessionId)

    await driver.activateApp(packageName)

    console.log('App pronto na tela inicial')
}

export const globalAfterEach: Options.Testrunner['afterTest'] = async (
  test,
  context,
  { passed }
) => {
  if (!passed) {
    const fileName = `./screenshots/FAIL_${test.title}_${Date.now()}.png`
    await browser.saveScreenshot(fileName)
  }
}