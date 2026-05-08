import { useEffect } from 'react'
import styles from './ConfirmModal.module.css'

const IconAlert = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

export default function ConfirmModal({
  title = 'Tem certeza?',
  message = 'Esta ação não pode ser desfeita.',
  confirmLabel = 'Excluir',
  onConfirm,
  onCancel,
  danger = true,
}) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={`${styles.iconWrap} ${danger ? styles.iconDanger : styles.iconNeutral}`}>
          <IconAlert />
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={`${styles.btnConfirm} ${danger ? styles.btnDanger : styles.btnNeutral}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
