import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tarefaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import styles from './DashboardPage.module.css'

const IconTotal = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
)
const IconClock = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)
const IconCheck = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M5 13l4 4L19 7"/>
  </svg>
)
const IconStar = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconClipboard = () => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"/>
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

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {saudacao}, {user?.nome?.split(' ')[0] || 'usuário'}!
            <span className={styles.starIcon}><IconStar /></span>
          </h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button className={styles.btnMain} onClick={() => navigate('/app/tarefas')}>
          Ver tarefas <IconArrow />
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <IconTotal />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{loading ? '—' : total}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef9c3', color: '#ca8a04' }}>
            <IconClock />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pendentes</span>
            <span className={styles.statValue}>{loading ? '—' : pendentes}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
            <IconCheck />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Concluídas</span>
            <span className={styles.statValue}>{loading ? '—' : concluidas}</span>
          </div>
        </div>

        <div className={styles.progressCard}>
          <div className={styles.progressTop}>
            <span className={styles.statLabel}>Progresso geral</span>
            <span className={styles.progressPct}>{pct}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <p className={styles.progressDesc}>{concluidas} de {total} tarefas concluídas</p>
        </div>
      </div>

      {/* ── Recentes ── */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2 className={styles.recentTitle}>Tarefas recentes</h2>
          <button className={styles.btnLink} onClick={() => navigate('/app/tarefas')}>
            Ver todas <IconArrow />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <span className={styles.spinner} />
          </div>
        ) : recentes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><IconClipboard /></div>
            <p className={styles.emptyTitle}>Nenhuma tarefa ainda</p>
            <p className={styles.emptyDesc}>Vá até a aba Tarefas e crie a sua primeira!</p>
          </div>
        ) : (
          <div className={styles.recentList}>
            {recentes.map(t => (
              <div key={t.id} className={styles.recentItem} onClick={() => navigate(`/app/tarefas/${t.id}`)}>
                <div className={`${styles.recentCheck} ${t.concluida ? styles.recentCheckDone : ''}`}>
                  {t.concluida && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <div className={styles.recentBody}>
                  <span className={`${styles.recentName} ${t.concluida ? styles.recentNameDone : ''}`}>
                    {t.titulo}
                  </span>
                  {t.descricao && <span className={styles.recentDesc}>{t.descricao}</span>}
                </div>
                <span className={`${styles.badge} ${t.concluida ? styles.badgeDone : styles.badgePending}`}>
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
