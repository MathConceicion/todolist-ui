import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tarefaApi } from '../services/api'
import { useToast } from '../context/ToastContext'
import TarefaModal from '../components/TarefaModal'
import styles from './TarefasPage.module.css'

const IconPlus = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

const IconEdit = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const IconTrash = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
  </svg>
)

const IconComment = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'concluidas', label: 'Concluídas' },
]

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todas')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [toggling, setToggling] = useState(null)
  const { push } = useToast()
  const navigate = useNavigate()

  async function load() {
    try {
      const data = await tarefaApi.listar()
      setTarefas(data)
    } catch {
      push('Erro ao carregar tarefas', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleToggle(t) {
    setToggling(t.id)
    try {
      const updated = await tarefaApi.atualizar(t.id, t.titulo, t.descricao, !t.concluida)
      setTarefas(prev => prev.map(x => x.id === t.id ? updated : x))
    } catch {
      push('Erro ao atualizar tarefa', 'error')
    } finally {
      setToggling(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir esta tarefa?')) return
    try {
      await tarefaApi.deletar(id)
      setTarefas(prev => prev.filter(t => t.id !== id))
      push('Tarefa excluída', 'success')
    } catch {
      push('Erro ao excluir', 'error')
    }
  }

  function handleEdit(t) {
    setEditTarget(t)
    setModalOpen(true)
  }

  function handleNew() {
    setEditTarget(null)
    setModalOpen(true)
  }

  async function handleSave(titulo, descricao) {
    try {
      if (editTarget) {
        const updated = await tarefaApi.atualizar(editTarget.id, titulo, descricao, editTarget.concluida)
        setTarefas(prev => prev.map(t => t.id === editTarget.id ? updated : t))
        push('Tarefa atualizada!', 'success')
      } else {
        const nova = await tarefaApi.criar(titulo, descricao)
        setTarefas(prev => [nova, ...prev])
        push('Tarefa criada!', 'success')
      }
      setModalOpen(false)
    } catch (err) {
      push(err.message || 'Erro ao salvar', 'error')
    }
  }

  const filtered = tarefas
    .filter(t => {
      if (filter === 'pendentes') return !t.concluida
      if (filter === 'concluidas') return t.concluida
      return true
    })
    .filter(t =>
      search.trim() === '' ||
      t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (t.descricao || '').toLowerCase().includes(search.toLowerCase())
    )

  const counts = {
    todas: tarefas.length,
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={`${styles.title} serif`}>Tarefas</h1>
          <p className={styles.subtitle}>{tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''} no total</p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>
          <IconPlus /> Nova tarefa
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`${styles.filterTab} ${filter === f.key ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className={styles.filterCount}>{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <input
          type="search"
          className={`input ${styles.searchInput}`}
          placeholder="Pesquisar tarefas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <span className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <p className="empty-title">
            {search ? 'Nenhum resultado' : filter === 'concluidas' ? 'Sem concluídas' : 'Nenhuma tarefa'}
          </p>
          <p className="empty-desc">
            {search ? 'Tente buscar por outro termo' : 'Clique em "Nova tarefa" para começar'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(t => (
            <div key={t.id} className={`${styles.taskCard} card`}>
              <button
                className={`${styles.checkBtn} ${t.concluida ? styles.checkBtnDone : ''}`}
                onClick={() => handleToggle(t)}
                disabled={toggling === t.id}
                title={t.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
              >
                {toggling === t.id ? (
                  <span className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
                ) : t.concluida ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                ) : null}
              </button>

              <div className={styles.taskBody} onClick={() => navigate(`/app/tarefas/${t.id}`)}>
                <div className={styles.taskTop}>
                  <span className={`${styles.taskTitle} ${t.concluida ? styles.taskTitleDone : ''}`}>
                    {t.titulo}
                  </span>
                  <span className={`badge ${t.concluida ? 'badge-done' : 'badge-pending'}`}>
                    {t.concluida ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
                {t.descricao && (
                  <p className={styles.taskDesc}>{t.descricao}</p>
                )}
                <div className={styles.taskMeta}>
                  <span className={styles.metaItem}>
                    {new Date(t.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className={styles.taskActions}>
                <button
                  className="btn-icon"
                  onClick={() => navigate(`/app/tarefas/${t.id}`)}
                  title="Comentários"
                >
                  <IconComment />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(t)}
                  title="Editar"
                >
                  <IconEdit />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(t.id)}
                  title="Excluir"
                  style={{ color: 'var(--red)' }}
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <TarefaModal
          tarefa={editTarget}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
