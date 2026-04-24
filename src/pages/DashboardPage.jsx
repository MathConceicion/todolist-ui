import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tarefaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import styles from './DashboardPage.module.css'

const IconCheck = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M5 13l4 4L19 7"/>
  </svg>
)

const IconClock = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)

const IconTotal = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
)

export default function DashboardPage() {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    tarefaApi.listar().then(setTarefas).catch(console.error).finally(() => setLoading(false))
  }, [])

  const total = tarefas.length
  const concluidas = tarefas.filter(t => t.concluida).length
  const pendentes = total - concluidas
  const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0

  const recentes = [...tarefas]
    .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
    .slice(0, 5)

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={`${styles.title} serif`}>
            {saudacao}, {user?.nome?.split(' ')[0] || 'usuário'} 👋
          </h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/tarefas')}>
          Ver todas as tarefas
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} card`}>
          <div className={styles.statIconWrap} style={{ background: 'var(--canvas-sunken)', color: 'var(--ink-soft)' }}>
            <IconTotal />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{loading ? '—' : total}</span>
          </div>
        </div>

        <div className={`${styles.statCard} card`}>
          <div className={styles.statIconWrap} style={{ background: 'var(--gold-bg)', color: 'var(--gold-dark)' }}>
            <IconClock />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pendentes</span>
            <span className={styles.statValue}>{loading ? '—' : pendentes}</span>
          </div>
        </div>

        <div className={`${styles.statCard} card`}>
          <div className={styles.statIconWrap} style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>
            <IconCheck />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Concluídas</span>
            <span className={styles.statValue}>{loading ? '—' : concluidas}</span>
          </div>
        </div>

        <div className={`${styles.progressCard} card`}>
          <div className={styles.progressTop}>
            <span className={styles.statLabel}>Progresso geral</span>
            <span className={styles.progressPct}>{pct}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <p className={styles.progressDesc}>
            {concluidas} de {total} tarefas concluídas
          </p>
        </div>
      </div>

      {/* ── Recent tasks ── */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2 className={`${styles.recentTitle} serif`}>Tarefas recentes</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tarefas')}>
            Ver todas →
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <span className="spinner" />
          </div>
        ) : recentes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-title">Nenhuma tarefa ainda</p>
            <p className="empty-desc">Crie sua primeira tarefa na aba Tarefas</p>
          </div>
        ) : (
          <div className={styles.recentList}>
            {recentes.map(t => (
              <div
                key={t.id}
                className={`${styles.recentItem} card`}
                onClick={() => navigate(`/app/tarefas/${t.id}`)}
              >
                <div className={`${styles.recentCheck} ${t.concluida ? styles.recentCheckDone : ''}`}>
                  {t.concluida && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <div className={styles.recentBody}>
                  <span className={`${styles.recentName} ${t.concluida ? styles.recentNameDone : ''}`}>
                    {t.titulo}
                  </span>
                  {t.descricao && (
                    <span className={styles.recentDesc}>{t.descricao}</span>
                  )}
                </div>
                <span className={`badge ${t.concluida ? 'badge-done' : 'badge-pending'}`}>
                  {t.concluida ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
