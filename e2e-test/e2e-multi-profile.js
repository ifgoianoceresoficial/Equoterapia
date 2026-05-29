const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// User credentials & properties
const adminUser = {
  name: "Admin Teste",
  username: "admin_test",
  birthDate: "1990-01-01",
  password: "password123",
  cpf: "11111111110",
  email: "admin_test@equoterapia.com",
  phone: "11999999990",
  address: "Rua Admin Teste",
  gender: "M",
  role: "PSICOLOGO",
  regNumber: "CRP123456",
  isAdmin: true
};

const terapeutaUser = {
  name: "Terapeuta Teste",
  username: "terapeuta_test",
  birthDate: "1992-02-02",
  password: "password123",
  cpf: "22222222220",
  email: "terapeuta_test@equoterapia.com",
  phone: "11888888880",
  address: "Rua Terapeuta Teste",
  gender: "F",
  role: "PSICOLOGO",
  regNumber: "CRP543210",
  isAdmin: false
};

const equitadorUser = {
  name: "Equitador Teste",
  username: "equitador_test",
  birthDate: "1994-03-03",
  password: "password123",
  cpf: "33333333330",
  email: "equitador_test@equoterapia.com",
  phone: "11777777770",
  address: "Rua Equitador Teste",
  gender: "M",
  role: "EQUITADOR",
  regNumber: "REG111110",
  isAdmin: false
};

async function registerAll() {
  console.log('--- Semeando contas de teste via API ---');
  await registerUser(adminUser);
  await registerUser(terapeutaUser);
  await registerUser(equitadorUser);
}

async function registerUser(user) {
  const url = user.isAdmin 
    ? 'http://localhost:8080/auth/register?adminPass=my-secret-key'
    : 'http://localhost:8080/auth/register';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: user.name,
        username: user.username,
        birthDate: user.birthDate,
        password: user.password,
        cpf: user.cpf,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        role: user.role,
        regNumber: user.regNumber
      })
    });
    if (res.status === 200 || res.status === 201) {
      console.log(`[OK] Usuário ${user.username} registrado com sucesso.`);
    } else {
      const text = await res.text();
      console.log(`[Aviso] Registro de ${user.username}: status=${res.status}, body=${text}`);
    }
  } catch (err) {
    console.error(`[Erro] Falha ao registrar ${user.username}:`, err.message);
  }
}

async function runTests() {
  console.log('\n--- Iniciando Navegador Chromium ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Dialog event listener to accept window.confirm modals
  page.on('dialog', async dialog => {
    console.log(`[Dialog] Aceitando modal do tipo "${dialog.type()}": "${dialog.message()}"`);
    await dialog.accept();
  });

  try {
    // ==========================================
    // 1. FLOW: ADMINISTRATOR
    // ==========================================
    console.log('\n==========================================');
    console.log('Iniciando Fluxo do Administrador...');
    console.log('==========================================');

    console.log('Acessando página de login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '01_admin_login.png') });

    console.log('Preenchendo credenciais do Admin...');
    await page.fill('#username', 'admin_test');
    await page.fill('#password', 'password123');
    await page.screenshot({ path: path.join(screenshotDir, '02_admin_login_filled.png') });

    console.log('Efetuando login...');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/agenda');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '03_admin_agenda.png') });

    console.log('Acessando Lista de Funcionários Ativos...');
    await page.goto('http://localhost:3000/listar-funcionarios-ativos');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '04_admin_listar_funcionarios.png') });

    const htmlFunc = await page.content();
    if (htmlFunc.includes('Admin Teste') || htmlFunc.includes('Terapeuta Teste') || htmlFunc.includes('Equitador Teste')) {
      console.log('✔ LISTA DE PROFISSIONAIS EXIBIDA COM SUCESSO! Usuários semeados encontrados.');
    } else {
      console.log('⚠ Alerta: Usuários semeados não listados.');
    }

    console.log('Acessando formulário de cadastro de praticante...');
    await page.goto('http://localhost:3000/cadastro-praticante');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '05_admin_cadastro_praticante_step1.png') });

    console.log('Avançando para o Passo 2...');
    await page.click('.btn-avancar');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '06_admin_cadastro_praticante_step2.png') });

    console.log('Submetendo cadastro completo do praticante...');
    await page.click('.btnP-concluir');
    await page.waitForURL('**/listar-praticantes');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '07_admin_praticantes_list.png') });

    console.log('Acessando detalhes do paciente "Lucas Martins"...');
    const patientLink = page.locator('.bg-praticante a:has-text("Lucas Martins")').first();
    await patientLink.click();
    await page.waitForURL('**/InformacoesPraticante/**');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '08_admin_praticante_details.png') });

    const detailsContent = await page.textContent('body');
    if (detailsContent.includes('Lucas Martins') && detailsContent.includes('Juliana Martins')) {
      console.log('✔ DETALHES DO PRATICANTE RENDERIZADOS CORRETAMENTE!');
    } else {
      console.log('⚠ Alerta: Campos esperados de detalhes do praticante não encontrados.');
    }

    console.log('Voltando para a lista de praticantes...');
    await page.click('button:has-text("Voltar para a Lista")');
    await page.waitForURL('**/listar-praticantes');
    await page.waitForTimeout(1500);

    console.log('Arquivando praticante "Lucas Martins" a partir da lista...');
    const activeCard = page.locator('.bg-praticante', { hasText: 'Lucas Martins' }).first();
    await activeCard.locator('button:has-text("Arquivar praticante")').click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(screenshotDir, '09_admin_praticante_arquivado.png') });

    console.log('Acessando Lista de Praticantes Arquivados...');
    await page.goto('http://localhost:3000/listar-praticantes-arquivados');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '10_admin_praticantes_arquivados.png') });
    
    const archivedHtml = await page.content();
    if (archivedHtml.includes('Lucas Martins')) {
      console.log('✔ PRATICANTE ENCONTRADO NA LISTA DE ARQUIVADOS COM SUCESSO!');
    } else {
      console.log('⚠ Alerta: Praticante não encontrado na lista de arquivados.');
    }

    console.log('Reativando praticante "Lucas Martins" a partir da lista de arquivados...');
    const archivedCard = page.locator('.bg-praticante', { hasText: 'Lucas Martins' }).first();
    await archivedCard.locator('button:has-text("Reativar praticante")').click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(screenshotDir, '10_5_admin_praticante_reativado.png') });

    console.log('Saindo do perfil Admin...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);

    // ==========================================
    // 2. FLOW: EQUOTERAPEUTA
    // ==========================================
    console.log('\n==========================================');
    console.log('Iniciando Fluxo do Equoterapeuta...');
    console.log('==========================================');

    console.log('Preenchendo credenciais do Terapeuta...');
    await page.fill('#username', 'terapeuta_test');
    await page.fill('#password', 'password123');
    await page.screenshot({ path: path.join(screenshotDir, '11_terapeuta_login_filled.png') });

    console.log('Efetuando login...');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/agenda-geral');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '12_terapeuta_agenda_geral.png') });

    console.log('Acessando Lista de Praticantes como Terapeuta...');
    await page.goto('http://localhost:3000/listar-praticantes');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '13_terapeuta_listar_praticantes.png') });

    console.log('Saindo do perfil Terapeuta...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);

    // ==========================================
    // 3. FLOW: EQUITADOR
    // ==========================================
    console.log('\n==========================================');
    console.log('Iniciando Fluxo do Equitador...');
    console.log('==========================================');

    console.log('Preenchendo credenciais do Equitador...');
    await page.fill('#username', 'equitador_test');
    await page.fill('#password', 'password123');
    await page.screenshot({ path: path.join(screenshotDir, '14_equitador_login_filled.png') });

    console.log('Efetuando login...');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/equitador/agenda');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '15_equitador_agenda.png') });

    console.log('Navegando para Cadastro de Equino...');
    await page.goto('http://localhost:3000/cadastrar-equino');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, '16_equitador_cadastro_equino.png') });

    const horseId = Math.floor(Math.random() * 100000);
    const horseName = `Trovão E2E ${horseId}`;
    const horseReg = `${100000 + Math.floor(Math.random() * 900000)}`;

    console.log(`Preenchendo formulário de cadastro de equino: "${horseName}" (Reg: ${horseReg})...`);
    await page.fill('#formGridEquinoNome', horseName);
    await page.fill('#formGridEquinoRegis', horseReg);
    await page.fill('#formGridEquinoRaca', 'Quarto de Milha');
    await page.selectOption('#formGridSexo', '0'); // Masculino
    await page.selectOption('#formGridIdade', '6'); // 6 anos
    await page.fill('#formGridEquinoPeso', '420');
    await page.fill('#formGridEquinoAltura', '1.65');
    await page.fill('#formGridEquinoPelagem', 'Castanho');
    await page.fill('#formGridEquinoObs', 'Estrela branca na testa');
    await page.fill('#formGridEquinoGait', 'Trote');
    await page.fill('#formGridEquinoEquipamento', 'Sela de Couro');
    await page.screenshot({ path: path.join(screenshotDir, '17_equitador_cadastro_equino_filled.png') });

    console.log('Submetendo formulário...');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/equitador/listar-equino');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '18_equitador_listar_equino.png') });

    console.log(`Acessando Detalhes do Equino cadastrado "${horseName}"...`);
    const itemContainer = page.locator('.item-container', { hasText: horseName }).first();
    await itemContainer.locator('a img').click();
    await page.waitForURL('**/dados-equino/**');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, '19_equitador_dados_equino.png') });

    const horseDetails = await page.textContent('body');
    if (horseDetails.includes(horseName) && horseDetails.includes('Quarto de Milha') && horseDetails.includes(horseReg)) {
      console.log('✔ DETALHES DO EQUINO EXIBIDOS CORRETAMENTE!');
    } else {
      console.log('⚠ Alerta: Informações do cavalo não encontradas na tela de detalhes.');
    }

    console.log('Saindo do perfil Equitador...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    console.log('\n==========================================');
    console.log('✔ TODOS OS FLUXOS E2E EXECUTADOS COM SUCESSO!');
    console.log('==========================================');

  } catch (err) {
    console.error('❌ Ocorreu um erro durante a execução do teste E2E:', err);
    await page.screenshot({ path: path.join(screenshotDir, 'error_state.png') });
  } finally {
    await browser.close();
  }
}

(async () => {
  await registerAll();
  await runTests();
})();
