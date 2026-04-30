import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { tarefaApi } from '../services/api'
import { useToast } from '../context/ToastContext'
import TarefaModal from '../components/TarefaModal'
import styles from './TarefasPage.module.css'

/* ── Icons ── */
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
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const IconList = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
)
const IconKanban = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/>
  </svg>
)
const IconSort = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M7 12h10M11 18h2"/>
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const IconEmptySearch = () => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
  </svg>
)
const IconEmptyList = () => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"/>
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
    <path d="M5 13l4 4L19 7"/>
  </svg>
)

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'concluidas', label: 'Concluídas' },
]

const SORT_OPTIONS = [
  { key: 'recentes', label: 'Mais recentes' },
  { key: 'antigas', label: 'Mais antigas' },
  { key: 'az', label: 'A → Z' },
  { key: 'za', label: 'Z → A' },
]

function sortTarefas(list, key) {
  return [...list].sort((a, b) => {
    if (key === 'recentes') return new Date(b.dataCriacao) - new Date(a.dataCriacao)
    if (key === 'antigas')  return new Date(a.dataCriacao) - new Date(b.dataCriacao)
    if (key === 'az')       return a.titulo.localeCompare(b.titulo)
    if (key === 'za')       return b.titulo.localeCompare(a.titulo)
    return 0
  })
}

/* ── Task Card ── */
function TaskCard({ t, onToggle, onEdit, onDelete, onNavigate, toggling, draggable, onDragStart, onDragOver, onDrop }) {
  return (
    <div
      className={`${styles.taskCard} card`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <button
        className={`${styles.checkBtn} ${t.concluida ? styles.checkBtnDone : ''}`}
        onClick={() => onToggle(t)}
        disabled={toggling === t.id}
        title={t.concluida ? 'Reabrir' : 'Concluir'}
      >
        {toggling === t.id
          ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
          : t.concluida ? <IconCheck /> : null}
      </button>

      <div className={styles.taskBody} onClick={() => onNavigate(t.id)}>
        <div className={styles.taskTop}>
          <span className={`${styles.taskTitle} ${t.concluida ? styles.taskTitleDone : ''}`}>
            {t.titulo}
          </span>
          <span className={`badge ${t.concluida ? 'badge-done' : 'badge-pending'}`}>
            {t.concluida ? 'Concluída' : 'Pendente'}
          </span>
        </div>
        {t.descricao && <p className={styles.taskDesc}>{t.descricao}</p>}
        <div className={styles.taskMeta}>
          <span className={styles.metaItem}>
            {new Date(t.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span className={styles.metaItem} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconComment /> Ver comentários
          </span>
        </div>
      </div>

      <div className={styles.taskActions}>
        <button className="btn-icon" onClick={() => onNavigate(t.id)} title="Comentários"><IconComment /></button>
        <button className="btn-icon" onClick={() => onEdit(t)} title="Editar"><IconEdit /></button>
        <button className="btn-icon" onClick={() => onDelete(t.id)} title="Excluir" style={{ color: 'var(--red)' }}><IconTrash /></button>
      </div>
    </div>
  )
}

/* ── Kanban Column ── */
function KanbanColumn({ title, color, tarefas, onToggle, onEdit, onDelete, onNavigate, toggling, onDropColumn, onNew }) {
  const [over, setOver] = useState(false)

  return (
    <div
      className={`${styles.kanbanCol} ${over ? styles.kanbanColOver : ''}`}
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); onDropColumn() }}
    >
      <div className={styles.kanbanHeader}>
        <div className={styles.kanbanHeaderLeft}>
          <span className={styles.kanbanDot} style={{ background: color }} />
          <span className={styles.kanbanTitle}>{title}</span>
          <span className={styles.kanbanCount}>{tarefas.length}</span>
        </div>
        <button className={styles.kanbanAddBtn} onClick={onNew} title="Nova tarefa">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      <div className={styles.kanbanCards}>
        {tarefas.length === 0 ? (
          <div className={styles.kanbanEmpty}>Arraste tarefas aqui</div>
        ) : (
          tarefas.map(t => (
            <div key={t.id} className={`${styles.kanbanCard} card`}
              draggable
              onDragStart={e => e.dataTransfer.setData('tarefaId', t.id)}
            >
              <div className={styles.kanbanCardBody} onClick={() => onNavigate(t.id)}>
                <p className={`${styles.kanbanCardTitle} ${t.concluida ? styles.taskTitleDone : ''}`}>{t.titulo}</p>
                {t.descricao && <p className={styles.kanbanCardDesc}>{t.descricao}</p>}
                <div className={styles.kanbanCardMeta}>
                  <span className={styles.metaItem}>
                    {new Date(t.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
              <div className={styles.kanbanCardActions}>
                <button className={`${styles.checkBtn} ${t.concluida ? styles.checkBtnDone : ''}`}
                  onClick={() => onToggle(t)} disabled={toggling === t.id}
                  style={{ width: 20, height: 20 }}
                >
                  {toggling === t.id
                    ? <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                    : t.concluida ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg> : null}
                </button>
                <button className="btn-icon" style={{ padding: 4 }} onClick={() => onEdit(t)}><IconEdit /></button>
                <button className="btn-icon" style={{ padding: 4, color: 'var(--red)' }} onClick={() => onDelete(t.id)}><IconTrash /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function TarefasPage() {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todas')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recentes')
  const [view, setView] = useState('list') // 'list' | 'kanban'
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [toggling, setToggling] = useState(null)
  const [showSort, setShowSort] = useState(false)
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

  // Atalho de teclado: N = nova tarefa
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName === 'BODY') {
        e.preventDefault()
        handleNew()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleToggle(t) {
    setToggling(t.id)
    try {
      const updated = await tarefaApi.atualizar(t.id, t.titulo, t.descricao, !t.concluida)
      setTarefas(prev => prev.map(x => x.id === t.id ? updated : x))
      push(updated.concluida ? '✓ Tarefa concluída!' : 'Tarefa reaberta', 'success')
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

  function handleEdit(t) { setEditTarget(t); setModalOpen(true) }
  function handleNew() { setEditTarget(null); setModalOpen(true) }

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

  // Drop no kanban
  async function handleKanbanDrop(tarefaId, concluida) {
    const t = tarefas.find(x => x.id === tarefaId)
    if (!t || t.concluida === concluida) return
    try {
      const updated = await tarefaApi.atualizar(t.id, t.titulo, t.descricao, concluida)
      setTarefas(prev => prev.map(x => x.id === t.id ? updated : x))
      push(concluida ? '✓ Movida para Concluídas' : 'Movida para Pendentes', 'success')
    } catch {
      push('Erro ao mover tarefa', 'error')
    }
  }

  function handleDragOver(e, targetId) {
    e.preventDefault()
  }

  function handleDrop(e, targetId) {
    e.preventDefault()
    // reorder — sem persistência, apenas visual por ora
  }

  const filtered = sortTarefas(
    tarefas
      .filter(t => {
        if (filter === 'pendentes') return !t.concluida
        if (filter === 'concluidas') return t.concluida
        return true
      })
      .filter(t =>
        search.trim() === '' ||
        t.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (t.descricao || '').toLowerCase().includes(search.toLowerCase())
      ),
    sort
  )

  const counts = {
    todas: tarefas.length,
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
  }

  const pendentes = sortTarefas(tarefas.filter(t => !t.concluida), sort)
  const concluidas = sortTarefas(tarefas.filter(t => t.concluida), sort)

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={`${styles.title} serif`}>Tarefas</h1>
          <p className={styles.subtitle}>
            {tarefas.length} tarefa{tarefas.length !== 1 ? 's' : ''} no total
            <span className={styles.kbdHint}>
              Pressione <kbd className="kbd">N</kbd> para criar
            </span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>
          <IconPlus /> Nova tarefa
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        {/* Filtros */}
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

        <div className={styles.toolbarRight}>
          {/* Busca */}
          <div className={styles.searchWrap}>
            <IconSearch />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Ordenação */}
          <div className={styles.sortWrap}>
            <button
              className={`${styles.sortBtn} ${showSort ? styles.sortBtnActive : ''}`}
              onClick={() => setShowSort(s => !s)}
            >
              <IconSort />
              <span className={styles.sortLabel}>{SORT_OPTIONS.find(s => s.key === sort)?.label}</span>
            </button>
            {showSort && (
              <div className={styles.sortDropdown}>
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.key}
                    className={`${styles.sortOption} ${sort === o.key ? styles.sortOptionActive : ''}`}
                    onClick={() => { setSort(o.key); setShowSort(false) }}
                  >
                    {o.label}
                    {sort === o.key && (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle view */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('list')} title="Visualização em lista"
            >
              <IconList />
            </button>
            <button
              className={`${styles.viewBtn} ${view === 'kanban' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('kanban')} title="Visualização Kanban"
            >
              <IconKanban />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <span className="spinner" />
        </div>
      ) : view === 'kanban' ? (
        /* ── Kanban ── */
        <div className={styles.kanbanBoard}>
          <KanbanColumn
            title="Pendentes"
            color="var(--gold)"
            tarefas={pendentes}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNavigate={id => navigate(`/app/tarefas/${id}`)}
            toggling={toggling}
            onDropColumn={() => {
              const id = window._dragId
              if (id) handleKanbanDrop(id, false)
            }}
            onNew={handleNew}
          />
          <KanbanColumn
            title="Concluídas"
            color="var(--green)"
            tarefas={concluidas}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNavigate={id => navigate(`/app/tarefas/${id}`)}
            toggling={toggling}
            onDropColumn={() => {
              const id = window._dragId
              if (id) handleKanbanDrop(id, true)
            }}
            onNew={handleNew}
          />
        </div>
      ) : filtered.length === 0 ? (
        /* ── Empty ── */
        <div className="empty-state">
          <div className="empty-icon" style={{ color: 'var(--ink-faint)' }}>
            {search ? <IconEmptySearch /> : <IconEmptyList />}
          </div>
          <p className="empty-title">
            {search ? 'Nenhum resultado' : filter === 'concluidas' ? 'Sem concluídas' : 'Nenhuma tarefa'}
          </p>
          <p className="empty-desc">
            {search ? 'Tente buscar por outro termo' : 'Clique em "Nova tarefa" ou pressione N'}
          </p>
        </div>
      ) : (
        /* ── List ── */
        <div className={styles.list}>
          {filtered.map(t => (
            <TaskCard
              key={t.id}
              t={t}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNavigate={id => navigate(`/app/tarefas/${id}`)}
              toggling={toggling}
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('tarefaId', t.id)
                window._dragId = t.id
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                window._dragId = null
              }}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <TarefaModal tarefa={editTarget} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
