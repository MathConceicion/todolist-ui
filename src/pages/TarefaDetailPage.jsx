import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tarefaApi, comentarioApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import TarefaModal from '../components/TarefaModal'
import ConfirmModal from '../components/ConfirmModal'
import styles from './TarefaDetailPage.module.css'

const IconBack = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
  </svg>
)
const IconEdit = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const IconSend = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
)
const IconInfo = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
  </svg>
)
const IconChat = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
    <path d="M5 13l4 4L19 7" />
  </svg>
)

function initials(nome) {
  return (nome || 'U').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}


const PRIORIDADES = {
  baixa: { label: 'Baixa', color: '#6b9e6b', bg: '#e8f5e8' },
  normal: { label: 'Normal', color: '#7c5d8a', bg: '#f3eef7' },
  alta: { label: 'Alta', color: '#c07a20', bg: '#fef3e2' },
  urgente: { label: 'Urgente', color: '#be185d', bg: '#fce7f3' },
}

export default function TarefaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { push } = useToast()

  const [tarefa, setTarefa] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [novoComentario, setNovoComentario] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    Promise.all([
      tarefaApi.buscar(id),
      comentarioApi.listar(id),
    ]).then(([t, c]) => {
      setTarefa(t)
      setComentarios(c)
    }).catch(() => {
      push('Erro ao carregar tarefa', 'error')
      navigate('/app/tarefas')
    }).finally(() => setLoading(false))
  }, [id])

  async function handleToggle() {
    setToggling(true)
    try {
      const updated = await tarefaApi.atualizar(tarefa.id, tarefa.titulo, tarefa.descricao, !tarefa.concluida, tarefa.prioridade, tarefa.dataVencimento)
      setTarefa(updated)
      push(updated.concluida ? 'Tarefa concluída!' : 'Tarefa reaberta', 'success')
    } catch { push('Erro ao atualizar', 'error') }
    finally { setToggling(false) }
  }

  async function handleDelete() {
    try {
      await tarefaApi.deletar(id)
      push('Tarefa excluída', 'success')
      navigate('/app/tarefas')
    } catch { push('Erro ao excluir', 'error') }
  }

  async function handleEdit(titulo, descricao, prioridade = 'normal', dataVencimento = null) {
    try {
      const updated = await tarefaApi.atualizar(tarefa.id, titulo, descricao, tarefa.concluida, prioridade, dataVencimento)
      setTarefa(updated)
      push('Tarefa atualizada!', 'success')
      setEditOpen(false)
    } catch (err) { push(err.message || 'Erro ao salvar', 'error') }
  }

  async function handleSendComment(e) {
    e.preventDefault()
    if (!novoComentario.trim()) return
    setSending(true)
    try {
      const c = await comentarioApi.criar(id, novoComentario.trim())
      setComentarios(prev => [...prev, c])
      setNovoComentario('')
    } catch { push('Erro ao comentar', 'error') }
    finally { setSending(false) }
  }

  async function handleDeleteComment(cid) {
    try {
      await comentarioApi.deletar(id, cid)
      setComentarios(prev => prev.filter(c => c.id !== cid))
      push('Comentário removido', 'success')
    } catch { push('Erro ao remover comentário', 'error') }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '80px' }}>
      <span className="spinner" />
    </div>
  )

  if (!tarefa) return null

  const pct = tarefa.concluida ? 100 : 0

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <button className={styles.btnBack} onClick={() => navigate('/app/tarefas')}>
          <IconBack /> Voltar
        </button>
        <div className={styles.topActions}>
          <button className={styles.btnEdit} onClick={() => setEditOpen(true)}>
            <IconEdit /> Editar
          </button>
          <button className={styles.btnDelete} onClick={() => setConfirmDelete(true)}>
            <IconTrash /> Excluir
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className={styles.layout}>

        {/* ── Coluna principal ── */}
        <div className={styles.main}>

          {/* Tarefa card */}
          <div className={styles.tarefaCard}>
            <div className={styles.tarefaHeader}>
              <button
                className={`${styles.bigCheck} ${tarefa.concluida ? styles.bigCheckDone : ''}`}
                onClick={handleToggle}
                disabled={toggling}
                title={tarefa.concluida ? 'Reabrir tarefa' : 'Marcar como concluída'}
              >
                {toggling
                  ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                  : tarefa.concluida ? <IconCheck /> : null}
              </button>
              <div className={styles.tarefaTitleWrap}>
                <h1 className={`${styles.tarefaTitle} ${tarefa.concluida ? styles.tarefaTitleDone : ''}`}>
                  {tarefa.titulo}
                </h1>
                <span className={`${styles.badge} ${tarefa.concluida ? styles.badgeDone : styles.badgePending}`}>
                  {tarefa.concluida ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            </div>

            {tarefa.descricao
              ? <p className={styles.tarefaDesc}>{tarefa.descricao}</p>
              : <p className={styles.tarefaDescEmpty}>Sem descrição</p>
            }

            <div className={styles.tarefaMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Criada em</span>
                <span className={styles.metaVal}>{new Date(tarefa.dataCriacao).toLocaleString('pt-BR')}</span>
              </div>
              {tarefa.atualizadaEm && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Atualizada em</span>
                  <span className={styles.metaVal}>{new Date(tarefa.atualizadaEm).toLocaleString('pt-BR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comentários */}
          <div className={styles.commentsSection}>
            <h2 className={styles.commentsTitle}>
              <span className={styles.sideCardIcon}><IconChat /></span>
              Comentários
              <span className={styles.commentsBadge}>{comentarios.length}</span>
            </h2>

            {comentarios.length === 0 ? (
              <div className={styles.emptyComments}>
                <div className={styles.emptyCommentsIcon}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <p className={styles.emptyCommentsText}>Nenhum comentário ainda</p>
                <p className={styles.emptyCommentsDesc}>Seja o primeiro a comentar</p>
              </div>
            ) : (
              <div className={styles.commentsList}>
                {comentarios.map(c => (
                  <div key={c.id} className={styles.commentCard}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAvatar}>{initials(c.nomeUsuario)}</div>
                      <div className={styles.commentMeta}>
                        <span className={styles.commentAuthor}>{c.nomeUsuario}</span>
                        <span className={styles.commentDate}>{new Date(c.criadoEm).toLocaleString('pt-BR')}</span>
                      </div>
                      {c.usuarioId === user?.id && (
                        <button className={styles.iconBtnDanger} onClick={() => handleDeleteComment(c.id)} title="Excluir">
                          <IconTrash />
                        </button>
                      )}
                    </div>
                    <p className={styles.commentText}>{c.conteudo}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário novo comentário */}
            <form onSubmit={handleSendComment} className={styles.commentForm}>
              <div className={styles.commentFormAvatar}>{initials(user?.nome)}</div>
              <div className={styles.commentInputWrap}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Escreva um comentário... (Enter para enviar)"
                  value={novoComentario}
                  onChange={e => setNovoComentario(e.target.value)}
                  rows={2}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendComment(e)
                    }
                  }}
                />
                <button type="submit" className={styles.btnSend}
                  disabled={sending || !novoComentario.trim()}>
                  {sending
                    ? <span className="spinner" style={{ width: 13, height: 13, borderWidth: 1.5 }} />
                    : <><IconSend /> Enviar</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Sidebar direita ── */}
        <div className={styles.sidebar}>

          {/* Card de detalhes */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>
              <span className={styles.sideCardIcon}><IconInfo /></span>
              Detalhes
            </h3>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status</span>
                <span className={`${styles.badge} ${tarefa.concluida ? styles.badgeDone : styles.badgePending}`}
                  style={{ width: 'fit-content', marginTop: 2 }}>
                  {tarefa.concluida ? 'Concluída' : 'Pendente'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Prioridade</span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 4,
                  padding: '3px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: PRIORIDADES[tarefa.prioridade]?.bg || '#f3eef7',
                  color: PRIORIDADES[tarefa.prioridade]?.color || '#7c5d8a',
                  width: 'fit-content',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: PRIORIDADES[tarefa.prioridade]?.color || '#7c5d8a',
                    flexShrink: 0,
                  }} />
                  {PRIORIDADES[tarefa.prioridade]?.label || 'Normal'}
                </span>
              </div>

              {tarefa.dataVencimento && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Vencimento</span>
                  <span className={styles.infoValue} style={{
                    color: tarefa.atrasada ? 'var(--red)' : 'var(--ink-soft)',
                    fontWeight: tarefa.atrasada ? 700 : 600,
                  }}>
                    {new Date(tarefa.dataVencimento).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                    {tarefa.atrasada && (
                      <span style={{
                        display: 'inline-block',
                        marginLeft: 6,
                        background: 'var(--red-bg)',
                        color: 'var(--red)',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: 99,
                      }}>atrasada</span>
                    )}
                  </span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Criada em</span>
                <span className={styles.infoValue}>
                  {new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Horário</span>
                <span className={styles.infoValue}>
                  {new Date(tarefa.dataCriacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {tarefa.atualizadaEm && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Última atualização</span>
                  <span className={styles.infoValue}>
                    {new Date(tarefa.atualizadaEm).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card de progresso */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>
              <span className={styles.sideCardIcon}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Progresso
            </h3>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Comentários</span>
                <span className={styles.infoValue}>{comentarios.length} comentário{comentarios.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className={styles.progressTrack} style={{ marginTop: 14 }}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 8, fontWeight: 600, textAlign: 'center' }}>
              {tarefa.concluida ? 'Tarefa concluída!' : 'Tarefa em andamento'}
            </p>
          </div>

        </div>
      </div>

      {editOpen && (
        <TarefaModal tarefa={tarefa} onSave={handleEdit} onClose={() => setEditOpen(false)} />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Excluir tarefa?"
          message={`A tarefa "${tarefa.titulo}" será excluída permanentemente.`}
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}