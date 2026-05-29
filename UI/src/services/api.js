import axios from 'axios';


// Rotas que não precisam de token de autenticação
const ignoreTokenRoutes = ['/auth/login', '/auth/register'];

// Configuração base da API
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        // Token expirado -> limpa do armazenamento local
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        localStorage.removeItem('isAdmin');
      } else {
        // Token válido -> adiciona no cabeçalho
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Erro ao analisar token no request:", err);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      localStorage.removeItem('isAdmin');
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response);
    return response;
  },
  error => {
    console.error('Erro na requisição:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'Sem resposta do servidor',
      config: error.config ? {
        url: error.config.url,
        method: error.config.method
      } : {}
    });
    
    // Tratamento centralizado para 401 Unauthorized / Token Expirado
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      localStorage.removeItem('isAdmin');
      localStorage.setItem('authError', 'Sessão expirada ou acesso negado. Faça login novamente.');
      window.location.href = '/login';
    }
    
    if (error.response) {
      console.error(`Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor. Verifique se o backend está rodando.');
      
      if (error.message && (error.message.includes('Network Error') || error.message.includes('CORS'))) {
        console.error(`
        =================================
        ERRO DE CORS DETECTADO
        =================================
        Este é provavelmente um erro de Cross-Origin Resource Sharing (CORS).
        O frontend está tentando acessar o backend, mas o navegador está bloqueando
        a requisição por motivos de segurança.
        
        POSSÍVEIS SOLUÇÕES:
        1. Verifique se o backend está em execução
        2. O backend deve incluir os cabeçalhos CORS apropriados:
           - Access-Control-Allow-Origin: http://localhost:3000
           - Access-Control-Allow-Methods: GET, POST, PUT, DELETE
           - Access-Control-Allow-Headers: Content-Type, Authorization
        3. A aplicação está usando um proxy configurado no package.json para
           redirecionar as requisições - pode ser necessário reiniciar o servidor
        
        Se o problema persistir, verifique a configuração CORS no servidor ou 
        consulte o administrador do sistema.
        =================================
        `);
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };
export default api;

