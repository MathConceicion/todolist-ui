import { useState, useEffect } from 'react'
import modalStyles from './TarefaModal.module.css'

const IconX = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const PRIORIDADES = [
  { key: 'baixa', label: 'Baixa', color: '#6b9e6b', bg: '#e8f5e8' },
  { key: 'normal', label: 'Normal', color: '#7c5d8a', bg: '#f3eef7' },
  { key: 'alta', label: 'Alta', color: '#c07a20', bg: '#fef3e2' },
  { key: 'urgente', label: 'Urgente', color: '#be185d', bg: '#fce7f3' },
]

export default function TarefaModal({ tarefa, onSave, onClose }) {
  const [titulo, setTitulo] = useState(tarefa?.titulo || '')
  const [descricao, setDescricao] = useState(tarefa?.descricao || '')
  const [prioridade, setPrioridade] = useState(tarefa?.prioridade || 'normal')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    setSaving(true)
    try {
      await onSave(titulo.trim(), descricao.trim(), prioridade)
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!tarefa

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Editar tarefa' : 'Nova tarefa'}</h2>
          <button className="btn-icon" onClick={onClose} style={{ border: 'none' }}>
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="field">
              <label htmlFor="titulo">Título *</label>
              <input
                id="titulo"
                type="text"
                className="input"
                placeholder="Nome da tarefa"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="desc">Descrição</label>
              <textarea
                id="desc"
                className="input"
                placeholder="Detalhes opcionais..."
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            <div className="field">
              <label>Prioridade</label>
              <div className={modalStyles.prioridadeGrid}>
                {PRIORIDADES.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    className={`${modalStyles.prioridadeBtn} ${prioridade === p.key ? modalStyles.prioridadeBtnActive : ''}`}
                    style={{
                      '--p-color': p.color,
                      '--p-bg': p.bg,
                    }}
                    onClick={() => setPrioridade(p.key)}
                  >
                    <span className={modalStyles.prioridadeDot} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !titulo.trim()}
            >
              {saving
                ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }} />
                : isEdit ? 'Salvar' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}