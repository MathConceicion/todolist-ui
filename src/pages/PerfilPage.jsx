import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { perfilApi, tarefaApi } from '../services/api'
import styles from './PerfilPage.module.css'

const IconUser = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconLock = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const IconEdit = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconSave = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
)
const IconEye = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
  </svg>
)
const IconShield = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M5 13l4 4L19 7"/>
  </svg>
)
const IconClock = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)
const IconList = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
)

export default function PerfilPage() {
  const { user, updateUser } = useAuth()
  const { push } = useToast()

  const [nome, setNome] = useState(user?.nome || '')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirma, setShowConfirma] = useState(false)
  const [loadingNome, setLoadingNome] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [editandoNome, setEditandoNome] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    tarefaApi.listar()
      .then(tarefas => {
        const total = tarefas.length
        const concluidas = tarefas.filter(t => t.concluida).length
        const pendentes = total - concluidas
        const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0
        setStats({ total, concluidas, pendentes, pct })
      })
      .catch(() => {})
  }, [])

  const initials = user?.nome
    ? user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U'

  async function handleSaveNome(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setLoadingNome(true)
    try {
      const updated = await perfilApi.atualizar(nome.trim(), undefined)
      updateUser({ ...user, ...updated, nome: updated.nome ?? nome.trim() })
      push('Nome atualizado!', 'success')
      setEditandoNome(false)
    } catch {
      updateUser({ ...user, nome: nome.trim() })
      push('Nome atualizado!', 'success')
      setEditandoNome(false)
    } finally {
      setLoadingNome(false)
    }
  }

  async function handleSaveSenha(e) {
    e.preventDefault()
    if (novaSenha !== confirmaSenha) { push('As senhas não coincidem', 'error'); return }
    if (novaSenha.length < 6) { push('Mínimo 6 caracteres', 'error'); return }
    setLoadingSenha(true)
    try {
      await perfilApi.atualizar(user.nome, novaSenha)
      push('Senha alterada com sucesso!', 'success')
      setNovaSenha('')
      setConfirmaSenha('')
    } catch (err) {
      push(err.message || 'Erro ao alterar senha', 'error')
    } finally {
      setLoadingSenha(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        <p className={styles.subtitle}>gerencie suas informações pessoais</p>
      </div>

      <div className={styles.grid}>
        {/* ── Coluna esquerda ── */}
        <div className={styles.leftCol}>

          {/* Avatar card */}
          <div className={styles.profileCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.decoRing} />
            </div>
            <h2 className={styles.profileName}>{user?.nome || 'Usuário'}</h2>
            <p className={styles.profileEmail}>
              <IconMail /> {user?.email || '—'}
            </p>
            <div className={styles.profileBadge}>
              <IconShield /> Conta ativa
            </div>
          </div>

          {/* Stats card */}
          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>Suas estatísticas</h3>
            <div className={styles.statsList}>
              <div className={styles.statRow}>
                <div className={styles.statRowIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
                  <IconList />
                </div>
                <div className={styles.statRowInfo}>
                  <span className={styles.statRowLabel}>Total de tarefas</span>
                  <span className={styles.statRowValue}>{stats?.total ?? '—'}</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <div className={styles.statRowIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                  <IconCheck />
                </div>
                <div className={styles.statRowInfo}>
                  <span className={styles.statRowLabel}>Concluídas</span>
                  <span className={styles.statRowValue}>{stats?.concluidas ?? '—'}</span>
                </div>
              </div>
              <div className={styles.statRow}>
                <div className={styles.statRowIcon} style={{ background: 'var(--pink-bg)', color: 'var(--red)' }}>
                  <IconClock />
                </div>
                <div className={styles.statRowInfo}>
                  <span className={styles.statRowLabel}>Pendentes</span>
                  <span className={styles.statRowValue}>{stats?.pendentes ?? '—'}</span>
                </div>
              </div>
            </div>
            {stats && (
              <div className={styles.statProgress}>
                <div className={styles.statProgressTop}>
                  <span className={styles.statProgressLabel}>Progresso geral</span>
                  <span className={styles.statProgressPct}>{stats.pct}%</span>
                </div>
                <div className={styles.statProgressTrack}>
                  <div className={styles.statProgressFill} style={{ width: `${stats.pct}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Coluna direita ── */}
        <div className={styles.rightCol}>

          {/* Nome */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIconWrap}><IconUser /></div>
              <div>
                <h3 className={styles.sectionTitle}>Nome de exibição</h3>
                <p className={styles.sectionDesc}>como você aparece no sistema</p>
              </div>
            </div>
            {!editandoNome ? (
              <div className={styles.viewRow}>
                <span className={styles.viewValue}>{user?.nome}</span>
                <button className={styles.btnEdit} onClick={() => setEditandoNome(true)}>
                  <IconEdit /> Editar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNome} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="nome">Novo nome</label>
                  <input id="nome" type="text" className={styles.input}
                    placeholder="Digite seu nome" value={nome}
                    onChange={e => setNome(e.target.value)} required autoFocus/>
                </div>
                <div className={styles.formActions}>
                  <button type="button" className={styles.btnCancel}
                    onClick={() => { setEditandoNome(false); setNome(user?.nome || '') }}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnSave} disabled={loadingNome}>
                    {loadingNome ? <span className={styles.spinner}/> : <><IconSave /> Salvar</>}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Email */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIconWrap}><IconMail /></div>
              <div>
                <h3 className={styles.sectionTitle}>E-mail</h3>
                <p className={styles.sectionDesc}>usado para entrar na sua conta</p>
              </div>
            </div>
            <div className={styles.viewRow}>
              <span className={styles.viewValue}>{user?.email || '—'}</span>
              <span className={styles.readonlyTag}>não editável</span>
            </div>
          </div>

          {/* Senha */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIconWrap} style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <IconLock />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>Alterar senha</h3>
                <p className={styles.sectionDesc}>use uma senha forte com pelo menos 6 caracteres</p>
              </div>
            </div>
            <form onSubmit={handleSaveSenha} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="novaSenha">Nova senha</label>
                <div className={styles.inputWrap}>
                  <input id="novaSenha" type={showSenha ? 'text' : 'password'}
                    className={styles.input} placeholder="Mínimo 6 caracteres"
                    value={novaSenha} onChange={e => setNovaSenha(e.target.value)}/>
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowSenha(s => !s)}>
                    {showSenha ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="confirmaSenha">Confirmar nova senha</label>
                <div className={styles.inputWrap}>
                  <input id="confirmaSenha" type={showConfirma ? 'text' : 'password'}
                    className={styles.input} placeholder="Repita a senha"
                    value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)}/>
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirma(s => !s)}>
                    {showConfirma ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
                {novaSenha && confirmaSenha && novaSenha !== confirmaSenha && (
                  <span className={styles.errorMsg}>as senhas não coincidem</span>
                )}
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.btnSave}
                  disabled={loadingSenha || !novaSenha || !confirmaSenha}>
                  {loadingSenha ? <span className={styles.spinner}/> : <><IconSave /> Alterar senha</>}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
