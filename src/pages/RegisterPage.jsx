import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import styles from './AuthPage.module.css'

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
      // auto-login after register
      const data = await authApi.login(email, senha)
      login(data.token, data.usuario)
      push('Conta criada com sucesso!', 'success')
      navigate('/app')
    } catch (err) {
      push(err.message || 'Erro ao criar conta', 'error')
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
          <h1 className={`${styles.title} serif`}>Crie sua conta</h1>
          <p className={styles.subtitle}>Comece a organizar suas tarefas hoje</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="field">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                className="input"
                placeholder="Seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold"
              style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '4px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" style={{ borderTopColor: '#fff' }} /> : 'Criar conta'}
            </button>
          </form>

          <p className={styles.switchText}>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.switchLink}>
              Entrar
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
          <p className="serif">"O segredo é começar. O começo é a metade de qualquer ação."</p>
          <cite>— Platão</cite>
        </blockquote>
      </div>
    </div>
  )
}
