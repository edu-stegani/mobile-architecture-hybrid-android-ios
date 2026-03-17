import type { Options } from '@wdio/types'

export const globalBeforeEach = async () => {
    console.log('Sessão iniciada:', browser.sessionId)
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