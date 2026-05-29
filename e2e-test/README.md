# Testes End-to-End (E2E) - Equoterapia

Este diretório contém os testes de integração End-to-End automatizados para a aplicação Equoterapia, desenvolvidos utilizando **Playwright**.

O script de teste (`e2e-multi-profile.js`) valida os fluxos completos de navegação e exibição para os três perfis de usuários principais da aplicação: **Administrador**, **Equoterapeuta** e **Equitador**.

## Pré-requisitos

1. Ter o **Node.js** instalado (versão 18 ou superior recomendada).
2. Estar com o Back-end (`API` na porta 8080) e o Front-end (`UI` na porta 3000) em execução localmente.

## Como Executar

1. Navegue até este diretório:
   ```bash
   cd e2e-test
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Instale os navegadores do Playwright (se for a primeira vez utilizando Playwright no ambiente):
   ```bash
   npx playwright install chromium
   ```

4. Execute os testes:
   ```bash
   npm test
   ```

Durante a execução, o teste irá interagir com o navegador em segundo plano (modo headless), registrar/semeará os usuários automaticamente na API e salvará capturas de tela (screenshots) das transições na pasta `e2e-test/screenshots/`.
