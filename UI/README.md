# 💻 Frontend - Equoterapia UI

O front-end do sistema **Equoterapia** é uma Single Page Application (SPA) desenvolvida em **React 18** utilizando componentes estilizados com **Bootstrap 5** e fontes modernas (Poppins). Ele consome os recursos da API REST de forma reativa e segura.

---

## 📂 Estrutura de Componentes e Código-Fonte

O diretório `src/` está organizado para facilitar a modularização por funcionalidades e perfis de usuário:

- **`src/App.js`**: Componente raiz da aplicação que concentra o sistema de roteamento (`React Router DOM v6`) com mais de 25 rotas públicas e protegidas.
- **`src/index.js`**: Ponto de entrada principal da aplicação que carrega os estilos globais do Bootstrap e renderiza a árvore de componentes do React.
- **`src/services/api.js`**: Centraliza as chamadas de API utilizando a biblioteca **Axios**. Possui interceptadores de requisição para injetar tokens JWT salvos e tratamentos de tempo limite (timeout de 10s).
- **`src/components/`**:
  - **Autenticação**: Telas de login (`Login.js`), recuperação de senha (`EsqueceuSenha.js`, `Codigo.js`, `NovaSenha.js`) e componente de rota protegida (`PrivateRoute.js`).
  - **Agenda / Calendário**: Componente interativo de agendamento (`Agenda.js`, `newAgenda.js`), navegador de datas (`DateNavigator.js`) e barra de busca (`SearchBar.js`).
  - **`administrador/`**: Telas administrativas para cadastro de profissionais, listagem de funcionários e painéis de controle.
  - **`equitador/`**: Componentes específicos para o gerenciamento de cavalos (`CadastrarEquino.js`, `ListarEquino.js`, `DadosEquino.js`) e agenda física dos equinos.
  - **`praticante/`**: Formulários de cadastro de pacientes (praticantes) estruturado em etapas, registro de anamnese, acompanhamento de sessões, feedback e encerramento clínico.

---

## 🛠️ Instalação e Inicialização

Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado.

1. **Instalar as dependências do projeto:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   > 📌 A aplicação iniciará no endereço **`http://localhost:3000`** e abrirá automaticamente no seu navegador.

---

## 🔌 Integração com o Back-end e Proxy local

Para evitar problemas de CORS (Cross-Origin Resource Sharing) em ambiente de desenvolvimento, o arquivo `package.json` está configurado com um proxy apontando para a API Spring Boot:

```json
"proxy": "http://localhost:8080"
```

Dessa forma, qualquer requisição HTTP relativa feita pelo Axios (como `api.post('/auth/login')`) será automaticamente roteada pelo servidor de desenvolvimento do React para `http://localhost:8080/auth/login`.

> ⚠️ **Atenção:** Certifique-se de que o backend Java esteja rodando na porta `8080` para que o frontend consiga autenticar e carregar as listagens.

---

## 🧪 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`
Executa o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo no navegador.

### `npm test`
Inicia o executor de testes no modo interativo (Jest + React Testing Library).

### `npm run build`
Compila a aplicação para produção na pasta `build`.\
O build é otimizado, minificado e pronto para ser servido por servidores web como Nginx ou Firebase Hosting.
