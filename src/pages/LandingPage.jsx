import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

const features = [
  {
    icon: '✦',
    title: 'Organize com elegância',
    desc: 'Crie, edite e conclua tarefas com uma interface limpa e sem distrações.',
  },
  {
    icon: '◈',
    title: 'Comentários em contexto',
    desc: 'Adicione notas e comentários diretamente em cada tarefa para manter o histórico.',
  },
  {
    icon: '⬡',
    title: 'Segurança com JWT',
    desc: 'Seus dados protegidos com autenticação via token, sem senha exposta.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      {/* ── Navbar ── */}
      <header className={styles.navbar}>
        <span className={`${styles.logo} serif`}>Task<em>Flow</em></span>
        <div className={styles.navActions}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>
            Entrar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Criar conta
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.dot} />
            Gerenciamento de tarefas
          </div>

          <h1 className={`${styles.heroTitle} serif`}>
            Foco no que<br />
            <em>realmente importa.</em>
          </h1>

          <p className={styles.heroDesc}>
            TaskFlow é a forma mais simples e elegante de organizar suas tarefas,
            adicionar contexto e acompanhar seu progresso dia a dia.
          </p>

          <div className={styles.heroActions}>
            <button className="btn btn-gold" style={{ padding: '13px 32px', fontSize: '15px' }} onClick={() => navigate('/register')}>
              Começar gratuitamente
            </button>
            <button className="btn btn-outline" style={{ padding: '13px 28px', fontSize: '15px' }} onClick={() => navigate('/login')}>
              Já tenho conta
            </button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.vcHeader}>
              <span className={styles.vcTitle}>Minhas tarefas</span>
              <span className={styles.vcBadge}>4 pendentes</span>
            </div>
            {[
              { text: 'Fazer exercícios físicos', done: true },
              { text: 'Beber 2L de água', done: true },
              { text: 'Organizar o quarto', done: false },
              { text: 'Lavar roupa', done: false },
              { text: 'Preparar refeições da semana', done: false },
            ].map((t, i) => (
              <div key={i} className={styles.vcTask}>
                <div className={`${styles.vcCheck} ${t.done ? styles.vcCheckDone : ''}`}>
                  {t.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`${styles.vcTaskText} ${t.done ? styles.vcTaskDone : ''}`}>
                  {t.text}
                </span>
              </div>
            ))}
            <div className={styles.vcProgress}>
              <div className={styles.vcProgressBar}>
                <div className={styles.vcProgressFill} style={{ width: '40%' }} />
              </div>
              <span className={styles.vcProgressLabel}>40% concluído</span>
            </div>
          </div>

          {/* Floating comment card */}
          <div className={styles.floatingComment}>
            <div className={styles.fcAvatar}>JP</div>
            <div>
              <p className={styles.fcName}>João Paulo</p>
              <p className={styles.fcText}>Compra pão quando sair🥖</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <p className={styles.featuresEyebrow}>Por que TaskFlow?</p>
          <h2 className={`${styles.featuresTitle} serif`}>
            Tudo que você precisa,<br />nada que não precisa.
          </h2>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} className={`${styles.featureCard} card`}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <h2 className={`${styles.ctaTitle} serif`}>
          Pronto para começar?
        </h2>
        <p className={styles.ctaDesc}>
          Crie sua conta em segundos e comece a organizar seu dia.
        </p>
        <button className="btn btn-gold" style={{ padding: '14px 36px', fontSize: '15px' }} onClick={() => navigate('/register')}>
          Criar conta gratuita
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={`${styles.logo} serif`} style={{ fontSize: '16px' }}>Task<em>Flow</em></span>
        <span className={styles.footerCopy}>© 2026 TaskFlow</span>
      </footer>
    </div>
  )
}
