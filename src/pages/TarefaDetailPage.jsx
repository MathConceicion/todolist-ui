import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tarefaApi, comentarioApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import TarefaModal from '../components/TarefaModal'
import styles from './TarefaDetailPage.module.css'

const IconBack = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
  </svg>
)

const IconTrash = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
  </svg>
)

const IconEdit = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const IconSend = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
  </svg>
)

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
      const updated = await tarefaApi.atualizar(tarefa.id, tarefa.titulo, tarefa.descricao, !tarefa.concluida)
      setTarefa(updated)
      push(updated.concluida ? 'Tarefa concluída!' : 'Tarefa reaberta', 'success')
    } catch {
      push('Erro ao atualizar', 'error')
    } finally {
      setToggling(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Excluir esta tarefa?')) return
    try {
      await tarefaApi.deletar(id)
      push('Tarefa excluída', 'success')
      navigate('/app/tarefas')
    } catch {
      push('Erro ao excluir', 'error')
    }
  }

  async function handleEdit(titulo, descricao) {
    try {
      const updated = await tarefaApi.atualizar(tarefa.id, titulo, descricao, tarefa.concluida)
      setTarefa(updated)
      push('Tarefa atualizada!', 'success')
      setEditOpen(false)
    } catch (err) {
      push(err.message || 'Erro ao salvar', 'error')
    }
  }

  async function handleSendComment(e) {
    e.preventDefault()
    if (!novoComentario.trim()) return
    setSending(true)
    try {
      const c = await comentarioApi.criar(id, novoComentario.trim())
      setComentarios(prev => [...prev, c])
      setNovoComentario('')
    } catch {
      push('Erro ao comentar', 'error')
    } finally {
      setSending(false)
    }
  }

  async function handleDeleteComment(cid) {
    try {
      await comentarioApi.deletar(id, cid)
      setComentarios(prev => prev.filter(c => c.id !== cid))
      push('Comentário removido', 'success')
    } catch {
      push('Erro ao remover comentário', 'error')
    }
  }

  function initials(nome) {
    return (nome || 'U').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '80px' }}>
        <span className="spinner" />
      </div>
    )
  }

  if (!tarefa) return null

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tarefas')}>
          <IconBack /> Voltar
        </button>
        <div className={styles.topActions}>
          <button className="btn btn-outline btn-sm" onClick={() => setEditOpen(true)}>
            <IconEdit /> Editar
          </button>
          <button className="btn btn-sm" style={{ color: 'var(--red)', border: '1.5px solid transparent' }}
            onClick={handleDelete}>
            <IconTrash /> Excluir
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ── Main ── */}
        <div className={styles.main}>
          <div className={`${styles.tarefaCard} card`}>
            <div className={styles.tarefaHeader}>
              <button
                className={`${styles.bigCheck} ${tarefa.concluida ? styles.bigCheckDone : ''}`}
                onClick={handleToggle}
                disabled={toggling}
                title={tarefa.concluida ? 'Reabrir tarefa' : 'Marcar como concluída'}
              >
                {toggling ? (
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                ) : tarefa.concluida ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                ) : null}
              </button>

              <div className={styles.tarefaTitleWrap}>
                <h1 className={`${styles.tarefaTitle} serif ${tarefa.concluida ? styles.tarefaTitleDone : ''}`}>
                  {tarefa.titulo}
                </h1>
                <span className={`badge ${tarefa.concluida ? 'badge-done' : 'badge-pending'}`}>
                  {tarefa.concluida ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            </div>

            {tarefa.descricao ? (
              <p className={styles.tarefaDesc}>{tarefa.descricao}</p>
            ) : (
              <p className={styles.tarefaDescEmpty}>Sem descrição</p>
            )}

            <div className={styles.tarefaMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Criada em</span>
                <span className={styles.metaVal}>
                  {new Date(tarefa.dataCriacao).toLocaleString('pt-BR')}
                </span>
              </div>
              {tarefa.atualizadaEm && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Atualizada em</span>
                  <span className={styles.metaVal}>
                    {new Date(tarefa.atualizadaEm).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Comments ── */}
          <div className={styles.commentsSection}>
            <h2 className={`${styles.commentsTitle} serif`}>
              Comentários
              <span className={styles.commentsBadge}>{comentarios.length}</span>
            </h2>

            {comentarios.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px' }}>
                <div className="empty-icon" style={{ fontSize: '28px' }}>💬</div>
                <p className="empty-title">Nenhum comentário</p>
                <p className="empty-desc">Seja o primeiro a comentar nesta tarefa</p>
              </div>
            ) : (
              <div className={styles.commentsList}>
                {comentarios.map(c => (
                  <div key={c.id} className={`${styles.commentCard} card`}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAvatar}>{initials(c.nomeUsuario)}</div>
                      <div className={styles.commentMeta}>
                        <span className={styles.commentAuthor}>{c.nomeUsuario}</span>
                        <span className={styles.commentDate}>
                          {new Date(c.criadoEm).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      {c.usuarioId === user?.id && (
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteComment(c.id)}
                          title="Excluir comentário"
                          style={{ color: 'var(--red)', marginLeft: 'auto' }}
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                    <p className={styles.commentText}>{c.conteudo}</p>
                  </div>
                ))}
              </div>
            )}

            {/* New comment form */}
            <form onSubmit={handleSendComment} className={styles.commentForm}>
              <div className={styles.commentFormAvatar}>{initials(user?.nome)}</div>
              <div className={styles.commentInputWrap}>
                <textarea
                  className={`input ${styles.commentInput}`}
                  placeholder="Escreva um comentário..."
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
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={sending || !novoComentario.trim()}
                  style={{ marginTop: '8px', alignSelf: 'flex-end' }}
                >
                  {sending ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} /> : <><IconSend /> Enviar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {editOpen && (
        <TarefaModal
          tarefa={tarefa}
          onSave={handleEdit}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  )
}
