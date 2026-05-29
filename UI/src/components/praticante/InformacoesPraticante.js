import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';

const AvatarPlaceholder = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '50%', background: '#ECFDF5', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.08 20 6.55 18.5 5.1 16.2C5.14 13.9 9.7 12.65 12 12.65C14.3 12.65 18.86 13.9 18.9 16.2C17.45 18.5 14.92 20 12 20Z" fill="#07C158"/>
  </svg>
);

const InformacoesPraticante = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [praticante, setPraticante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);

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
        <div style={estilos.loadingBox}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Carregando…</span>
          </div>
          <p style={{ marginTop: '12px', fontWeight: '500', color: '#64748B' }}>Carregando dados do praticante…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={estilos.container}>
        <div className="alert alert-danger shadow-sm border-0 p-4" style={{ borderRadius: '16px' }} role="alert">
          <h4 className="alert-heading fw-bold mb-3">Erro ao Carregar Dados</h4>
          <p className="mb-2">{error}</p>
          {errorDetail && (
            <p className="text-muted mb-4" style={{ fontSize: '13px' }}>
              Detalhes técnicos: {errorDetail}
            </p>
          )}
          <button onClick={() => navigate('/listar-praticantes')} style={estilos.button}>
            <FaArrowLeft /> Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  if (!praticante) {
    return (
      <div style={estilos.container}>
        <div className="alert alert-warning shadow-sm border-0 p-4" style={{ borderRadius: '16px' }} role="alert">
          <h4 className="alert-heading fw-bold mb-3">Praticante não Encontrado</h4>
          <p className="mb-4">Os registros indicam que este praticante não existe ou foi removido do banco de dados.</p>
          <button onClick={() => navigate('/listar-praticantes')} style={estilos.button}>
            <FaArrowLeft /> Voltar para lista
          </button>
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
      {/* Header Profile Card */}
      <div style={estilos.headerCard}>
        <div style={estilos.decoBg}></div>
        <AvatarPlaceholder />
        <div style={estilos.headerInfo}>
          <h2 style={estilos.headerName}>{praticante.name || 'Nome não informado'}</h2>
          <div style={estilos.headerDetails}>
            <span><strong>Idade:</strong> {praticante.age ? `${praticante.age} anos` : 'Não informada'}</span>
            <span>•</span>
            <span><strong>Sexo:</strong> {getGeneroExibicao(praticante.gender)}</span>
            <span>•</span>
            <span><strong>Fone:</strong> {praticante.phoneNumber || 'Não informado'}</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Card 1: Identificação */}
        <div className="col-12 col-lg-6">
          <div style={estilos.card}>
            <h4 style={estilos.sectionTitle}>Dados de Identificação</h4>
            <div className="row">
              <div className="col-6" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Cartão SUS</span>
                <span style={estilos.fieldValue}>{praticante.susNumber || 'Não informado'}</span>
              </div>
              <div className="col-6" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Data Nascimento</span>
                <span style={estilos.fieldValue}>{formatarData(praticante.birthDate)}</span>
              </div>
              <div className="col-12" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Cuidado / Responsável</span>
                <span style={estilos.fieldValue}>{praticante.caregiverName || 'Não informado'}</span>
              </div>
              <div className="col-12" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Nome do Pai</span>
                <span style={estilos.fieldValue}>{praticante.fatherName || 'Não informado'}</span>
              </div>
              <div className="col-12" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Nome da Mãe</span>
                <span style={estilos.fieldValue}>{praticante.motherName || 'Não informado'}</span>
              </div>
              <div className="col-12" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Endereço Completo</span>
                <span style={estilos.fieldValue}>{praticante.address || 'Não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Escolaridade */}
        <div className="col-12 col-lg-6">
          <div style={estilos.card}>
            <h4 style={estilos.sectionTitle}>Escolaridade do Praticante</h4>
            <div className="row">
              <div className="col-12" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Instituição de Ensino</span>
                <span style={estilos.fieldValue}>{praticante.schoolName || 'Não informada'}</span>
              </div>
              <div className="col-6" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Ano / Série</span>
                <span style={estilos.fieldValue}>{praticante.schoolYear ? `${praticante.schoolYear}º ano` : 'Não informado'}</span>
              </div>
              <div className="col-6" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Turma</span>
                <span style={estilos.fieldValue}>{praticante.scholarClass || 'Não informada'}</span>
              </div>
              <div className="col-12" style={estilos.fieldGroup}>
                <span style={estilos.fieldLabel}>Turno de Estudo</span>
                <span style={estilos.fieldValue}>{praticante.schoolShift || 'Não informado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Diagnóstico Clínico */}
        <div className="col-12">
          <div style={estilos.card}>
            <h4 style={estilos.sectionTitle}>Diagnóstico Clínico</h4>
            <div style={estilos.diagnosisBox}>
              {praticante.clinicDiagnosis || 'Sem diagnóstico clínico cadastrado no prontuário do praticante.'}
            </div>
          </div>
        </div>
      </div>

      <div style={estilos.buttonContainer}>
        <button onClick={() => navigate('/listar-praticantes')} style={estilos.button}>
          <FaArrowLeft /> Voltar para a Lista
        </button>
      </div>
    </div>
  );
};

const estilos = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 0',
  },
  headerCard: {
    background: 'linear-gradient(135deg, var(--primary-color) 0%, #06a348 100%)',
    borderRadius: '16px',
    padding: '24px 30px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '28px',
    boxShadow: '0 8px 24px rgba(7, 193, 88, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  decoBg: {
    position: 'absolute',
    top: '-30%',
    right: '-5%',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    pointerEvents: 'none',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    zIndex: 2,
  },
  headerName: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerDetails: {
    fontSize: '13px',
    opacity: 0.95,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '2px',
  },
  card: {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(8px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--card-shadow)',
    height: '100%',
  },
  sectionTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-main)',
    marginBottom: '20px',
    paddingLeft: '12px',
    borderLeft: '4px solid var(--primary-color)',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  fieldLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '3px',
  },
  fieldValue: {
    fontSize: '14.5px',
    color: 'var(--text-main)',
    fontWeight: '500',
  },
  diagnosisBox: {
    background: 'var(--primary-light)',
    border: '1px solid rgba(7, 193, 88, 0.15)',
    borderRadius: '12px',
    padding: '18px 24px',
    fontSize: '14.5px',
    color: '#065f46',
    lineHeight: '1.6',
    fontWeight: '500',
    whiteSpace: 'pre-wrap',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '32px',
    justifyContent: 'flex-start',
  },
  button: {
    padding: '10px 24px',
    backgroundColor: '#1e293b',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 10px rgba(30, 41, 59, 0.15)',
    transition: 'var(--transition-smooth)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  }
};

export default InformacoesPraticante;
