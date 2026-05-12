# Projeto de Testes Automatizados: App Vidalink | Android & iOS

Projeto de automação de testes mobile utilizando **WebdriverIO**, **Appium** e **TypeScript**. Este repositório foca em testes funcionais e de regressão, seguindo as melhores práticas de desenvolvimento.

---

## Tecnologias e Frameworks
As principais ferramentas utilizadas no desenvolvimento deste projeto são:

* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Engine de Testes:** [WebdriverIO](https://webdriver.io/)
* **Runner:** [Mocha](https://mochajs.org/)
* **Driver de Automação:** [Appium](http://appium.io/)
* **Padrão de Projeto:** Page Object Model (POM)
* **Relatórios:** Allure Report
* **Device Farm:** [BrowserStack](https://app-automate.browserstack.com/home) 

---

## Configuração do Ambiente

Antes de iniciar, é necessário configurar o ambiente de desenvolvimento (Node.js, Java SDK, Android Studio/Xcode e Appium Server). 

> 📘 **Guia de Instalação Detalhado:**
> Para um passo a passo completo de como configurar as variáveis de ambiente, ferramentas e emuladores, acesse o link abaixo:
> [Clique aqui para acessar o Manual de Configuração (DOCX)](https://docs.google.com/document/d/1XvkCyRqsMdENAYeXNeGc3riJiGdPR0y6Krmkwac8ufI/edit?usp=sharing)

---

## Como baixar e instalar

Siga os passos abaixo para clonar o repositório e preparar as dependências:

1.  **Clonar o repositório:**
    ```bash
    # no terminal, execute:
    git clone git@gitlab.vidalink.com.br:vidalink/ds/qa/qa-automacao-mobile-hibrido.git

    # Acesse a pasta do projeto
    cd qa-automacao-mobile-hibrido
    ```

2.  **Instalar as dependências:**
    ```bash
    npm install
    ```

---

## Executando os Testes

Certifique-se de que o **Appium Server** esteja rodando e um **Emulador/Simulador** (ou dispositivo real) esteja conectado e autorizado via ADB/Xcodepara execuções locais. Para execuções na BrowserStack, garanta que as credenciais e configurações estejam corretas em .env.
O projeto dispõe de arquivos de configuração separados para Android e iOS (execução local e browserstack), localizados na pasta `config/`. Para executa-los basta usar o script correspondente no package.json:

### Executar todos os testes:
```bash
npm run test:local:android
npm run test:local:ios

npm run test:android:bstack
npm run test:ios:bstack
```

### Relatórios Allure (opcional):
```bash
# Gerando relatório após execução dos testes
npm run report:generate

# Abrindo o relatório no navegador
npm run report:open

# Antes garanta que a pasta allure-results esteja limpa para evitar dados antigos
npm run clean:allure
```

## Como fazer upload do app para o BrowserStack:
```bash
#  Substitua "app.apk" pelo nome do seu arquivo .apk ou .app/.ipa
curl.exe -u "qavidalink_y3UBup:HbVSrxv12Pqs7L9CRpbd" `
-X POST "https://api-cloud.browserstack.com/app-automate/upload" `
-F "file=@app/app.apk"
```

## 📁 Estrutura do Projeto
Para facilitar a manutenção, o projeto segue a seguinte estrutura:

- tests/specs: Arquivos de teste (scripts/cenários).

- screens/android ou ios: Mapeamento de elementos e ações das telas.

- support: massas de testes, ganchos, utilitários(api e banco de dados).

- config: Configurações do WebdriverIO e Capabilities (Android/iOS e local/browserstack).

- app: Local onde devem ser armazenados os arquivos .apk ou .app / .ipa.

## Autor e Time de QA
Este projeto é desenvolvido e mantido pelo time de Qualidade:

Responsável: Eduardo Stegani - estegani@vidalink.com.br

### Time de QA:

- Brenno Carvalho

- Isis Moura Leite

- Maria Eduarda Pelaggi
