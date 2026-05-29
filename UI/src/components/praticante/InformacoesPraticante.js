import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CabecalhoSessao from './CabecalhoSessao';

const InformacoesPraticante = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [praticante, setPraticante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);

  const tamanhoTituloVerde = '25px';
  const tamanhoTextoPreto = '18px';

  useEffect(() => {
    const fetchPraticante = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetail(null);

        console.log(`Buscando praticante com ID: ${id}`);
        
        const response = await api.get(`/pacients/${id}`);

        if (response.data) {
          console.log('Praticante carregado com sucesso:', response.data);
          setPraticante(response.data);
        } else {
          console.warn('API retornou resposta vazia');
          throw new Error('Dados não encontrados');
        }
      } catch (err) {
        console.error('Falha ao carregar praticante:', err);
        
        let mensagemErro = 'Não foi possível carregar os detalhes do praticante';
        let detalhesErro = '';
        
        if (err.response) {
          mensagemErro += ` (Erro ${err.response.status})`;
          detalhesErro = JSON.stringify(err.response.data);
        } else if (err.request) {
          mensagemErro += ' (Servidor não respondeu)';
          detalhesErro = 'O servidor não retornou uma resposta. Verifique se o backend está rodando na porta 8080.';
        } else {
          detalhesErro = err.message;
        }
        
        setError(mensagemErro);
        setErrorDetail(detalhesErro);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPraticante();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p>Carregando dados do praticante...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.textoPreto}>{error}</p>
          {errorDetail && (
            <p style={{...estilos.textoPreto, fontSize: '14px', color: '#666'}}>
              Detalhes: {errorDetail}
            </p>
          )}
          <div style={estilos.buttonContainer}>
            <button onClick={() => navigate('/listar-praticantes')} style={estilos.button}>
              Voltar para lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!praticante) {
    return (
      <div style={estilos.container}>
        <CabecalhoSessao />
        <div style={estilos.contentContainer}>
          <p style={estilos.textoPreto}>Praticante não encontrado.</p>
          <div style={estilos.buttonContainer}>
            <button onClick={() => navigate('/listar-praticantes')} style={estilos.button}>
              Voltar para lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tratamento da data de nascimento para evitar fuso horário retroativo
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Não informada';
    try {
      const parts = dataStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dataStr;
    } catch (e) {
      return dataStr;
    }
  };

  const getGeneroExibicao = (gen) => {
    if (gen === 'M' || gen === 'MASCULINO') return 'Masculino';
    if (gen === 'F' || gen === 'FEMININO') return 'Feminino';
    return gen || 'Não informado';
  };

  return (
    <div style={estilos.container}>
      <CabecalhoSessao />
      <div style={estilos.contentContainer}>
        <div style={estilos.section}>
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Dados de Identificação</h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome Completo:</strong> {praticante.name || 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Sexo:</strong> {getGeneroExibicao(praticante.gender)}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nº Cartão SUS:</strong> {praticante.susNumber || 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Data de Nascimento:</strong> {formatarData(praticante.birthDate)} {praticante.age ? `(${praticante.age} anos)` : ''}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Telefone:</strong> {praticante.phoneNumber || 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Endereço:</strong> {praticante.address || 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Cuidador:</strong> {praticante.caregiverName || 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome do Pai:</strong> {praticante.fatherName || 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Nome da Mãe:</strong> {praticante.motherName || 'Não informado'}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Escolaridade do Praticante</h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Instituição de Ensino:</strong> {praticante.schoolName || 'Não informada'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Ano/Série:</strong> {praticante.schoolYear ? `${praticante.schoolYear}º` : 'Não informado'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Turma:</strong> {praticante.scholarClass || 'Não informada'}</p>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto }}><strong>Turno:</strong> {praticante.schoolShift || 'Não informado'}</p>
        </div>

        <div style={estilos.section}>
          <h4 style={{ ...estilos.tituloVerde, fontSize: tamanhoTituloVerde, fontWeight: 'bold' }}>Diagnóstico Clínico</h4>
          <p style={{ ...estilos.textoPreto, fontSize: tamanhoTextoPreto, whiteSpace: 'pre-wrap' }}>{praticante.clinicDiagnosis || 'Sem diagnóstico cadastrado'}</p>
        </div>

        <div style={estilos.buttonContainer}>
          <button onClick={() => navigate('/listar-praticantes')} style={estilos.button}>
            Voltar para a Lista
          </button>
        </div>
      </div>
    </div>
  );
};

const estilos = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    marginLeft: '10px'
  },
  contentContainer: {
    marginLeft: '10px',
    marginRight: '20px',
    marginTop: '30px',
    marginBottom: '20px'
  },
  section: {
    marginBottom: '20px',
  },
  tituloVerde: {
    color: '#07C158',
    margin: '0'
  },
  textoPreto: {
    color: '#000',
    margin: '5px 0'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0275d8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default InformacoesPraticante;

