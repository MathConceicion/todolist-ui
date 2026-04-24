import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './AuthPage.module.css'

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
      push('Bem-vindo de volta!', 'success')
      navigate('/app')
    } catch (err) {
      push(err.message || 'Falha ao entrar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.panelBrand}>
          <Link to="/" className={`${styles.logo} serif`}>Task<em>Flow</em></Link>
        </div>

        <div className={styles.panelBody}>
          <h1 className={`${styles.title} serif`}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>Entre com sua conta para continuar</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                className="input"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '4px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Entrar'}
            </button>
          </form>

          <p className={styles.switchText}>
            Não tem conta?{' '}
            <Link to="/register" className={styles.switchLink}>
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.decoration}>
        <div className={styles.decorGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.decorCell} />
          ))}
        </div>
        <blockquote className={styles.quote}>
          <p className="serif">"A disciplina é a ponte entre metas e realizações."</p>
          <cite>— Jim Rohn</cite>
        </blockquote>
      </div>
    </div>
  )
}
