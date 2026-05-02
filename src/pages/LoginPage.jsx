import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './AuthPage.module.css'

const IconMail = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await authApi.login(email, senha)
      login(data.token, data.usuario)
      push('Bem-vinda de volta!', 'success')
      navigate('/app')
    } catch (err) {
      push(err.message || 'Ops! Algo deu errado', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.charSide}>
        <div className={styles.charWrap}>
          <img src="/personagem.png" alt="Personagem" className={styles.charImg}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          <div className={styles.charFallback}>
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#e8b4d4" strokeWidth="1.2">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <p>seu personagem aqui!</p>
            <small>public/personagem.png</small>
          </div>
        </div>
        <div className={styles.charBubble}>
          Que bom te ver!
          <span className={styles.bubbleStar}><IconStar /></span>
        </div>
        <div className={styles.charDeco}>
          <div className={styles.decoCircle} style={{ background: '#fce7f3', width: 12, height: 12 }} />
          <div className={styles.decoCircle} style={{ background: '#e9d5ff', width: 8, height: 8 }} />
          <div className={styles.decoCircle} style={{ background: '#bbf7d0', width: 10, height: 10 }} />
          <div className={styles.decoCircle} style={{ background: '#fce7f3', width: 6, height: 6 }} />
          <div className={styles.decoCircle} style={{ background: '#e9d5ff', width: 14, height: 14 }} />
        </div>
      </div>

      <div className={styles.formSide}>
        <Link to="/" className={styles.logo}>Task<em>Flow</em></Link>

        <div className={styles.formBox}>
          <h1 className={styles.title}>Bem-vinda de volta</h1>
          <p className={styles.subtitle}>Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">
                <span className={styles.labelIcon}><IconMail /></span>
                E-mail
              </label>
              <input id="email" type="email" className={styles.input}
                placeholder="seu@email.com" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div className={styles.field}>
              <label htmlFor="senha">
                <span className={styles.labelIcon}><IconLock /></span>
                Senha
              </label>
              <input id="senha" type="password" className={styles.input}
                placeholder="••••••••" value={senha}
                onChange={e => setSenha(e.target.value)} required autoComplete="current-password" />
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : <><span>Entrar</span><IconArrow /></>}
            </button>
          </form>

          <p className={styles.switchText}>
            Não tem conta ainda?{' '}
            <Link to="/register" className={styles.switchLink}>Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
