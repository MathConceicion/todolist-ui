import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './AuthPage.module.css'

const IconUser = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
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
const IconHeart = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

export default function RegisterPage() {
  const [nome, setNome] = useState('')
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
      await authApi.register(nome, email, senha)
      const data = await authApi.login(email, senha)
      login(data.token, data.usuario)
      push('Conta criada! Bem-vinda!', 'success')
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
          Que feliz que você veio!
          <span className={styles.bubbleStar}><IconHeart /></span>
        </div>
        <div className={styles.charDeco}>
          <div className={styles.decoCircle} style={{ background: '#e9d5ff', width: 12, height: 12 }} />
          <div className={styles.decoCircle} style={{ background: '#fce7f3', width: 8, height: 8 }} />
          <div className={styles.decoCircle} style={{ background: '#fce7f3', width: 14, height: 14 }} />
          <div className={styles.decoCircle} style={{ background: '#bbf7d0', width: 8, height: 8 }} />
          <div className={styles.decoCircle} style={{ background: '#e9d5ff', width: 10, height: 10 }} />
        </div>
      </div>

      <div className={styles.formSide}>
        <Link to="/" className={styles.logo}>Task<em>Flow</em></Link>

        <div className={styles.formBox}>
          <h1 className={styles.title}>Criar sua conta</h1>
          <p className={styles.subtitle}>Vamos começar a organizar juntos</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="nome">
                <span className={styles.labelIcon}><IconUser /></span>
                Seu nome
              </label>
              <input id="nome" type="text" className={styles.input}
                placeholder="Como quer ser chamada?" value={nome}
                onChange={e => setNome(e.target.value)} required autoComplete="name" />
            </div>

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
                placeholder="Mínimo 6 caracteres" value={senha}
                onChange={e => setSenha(e.target.value)} required minLength={6} autoComplete="new-password" />
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : <><span>Criar conta</span><IconArrow /></>}
            </button>
          </form>

          <p className={styles.switchText}>
            Já tem conta?{' '}
            <Link to="/login" className={styles.switchLink}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
