import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

const IconHeart = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)
const IconChat = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)
const IconShield = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const IconStar = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconSparkle = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
)
const IconCheck = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
    <path d="M5 13l4 4L19 7" />
  </svg>
)

const features = [
  { Icon: IconHeart, title: 'Organize com carinho', desc: 'Crie, edite e conclua tarefas com uma interface simples e sem estresse.' },
  { Icon: IconChat, title: 'Comentários em contexto', desc: 'Adicione notas e comentários em cada tarefa para manter tudo em ordem.' },
  { Icon: IconShield, title: 'Seguro e só seu', desc: 'Seus dados protegidos com autenticação JWT. Ninguém além de você acessa.' },
]

const miniTasks = [
  { text: 'Estudar para a prova', done: true },
  { text: 'Fazer exercícios', done: true },
  { text: 'Ligar para a mamãe', done: false },
  { text: 'Ler pelo menos 20 págs', done: false },
]

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <span className={styles.logo}>Task<em>Flow</em></span>
        <div className={styles.navActions}>
          <button className={styles.btnGhost} onClick={() => navigate('/login')}>Entrar</button>
          <button className={styles.btnMain} onClick={() => navigate('/register')}>Criar conta</button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBubble}><IconSparkle /> Organização do jeito certo</div>
          <h1 className={styles.heroTitle}>
            Suas tarefas,<br />
            <span className={styles.heroTitleAccent}>do seu jeito</span>
          </h1>
          <p className={styles.heroDesc}>
            TaskFlow é a forma mais simples de organizar o seu dia,
            acompanhar seu progresso e manter tudo sob controle.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnMain} style={{ padding: '14px 36px', fontSize: '16px' }} onClick={() => navigate('/register')}>
              Começar agora <IconArrow />
            </button>
            <button className={styles.btnGhost} style={{ padding: '14px 28px', fontSize: '16px' }} onClick={() => navigate('/login')}>
              Já tenho conta
            </button>
          </div>
          <div className={styles.miniPreview}>
            <div className={styles.miniPreviewHeader}>
              <span className={styles.miniPreviewTitle}>Minhas tarefas</span>
              <span className={styles.miniPreviewBadge}>hoje</span>
            </div>
            {miniTasks.map((t, i) => (
              <div key={i} className={styles.miniTask}>
                <div className={`${styles.miniCheck} ${t.done ? styles.miniCheckDone : ''}`}>
                  {t.done && <IconCheck />}
                </div>
                <span className={`${styles.miniTaskText} ${t.done ? styles.miniTaskDone : ''}`}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.heroChar}>
          <div className={styles.charPlaceholder}>
            <img src="/personagem.png" alt="Personagem" className={styles.charImg}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
            <div className={styles.charFallback}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#f5c6d8" strokeWidth="1.2">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <p>seu personagem aqui!</p>
              <small>public/personagem.png</small>
            </div>
          </div>
          <div className={styles.speechBubble}>
            Vamos ser produtivos hoje?
            <span className={styles.speechStar}><IconStar /></span>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Por que o TaskFlow?</h2>
        <div className={styles.featuresGrid}>
          {features.map(({ Icon, title, desc }, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIconWrap}><Icon /></div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Pronto pra começar?</h2>
          <p className={styles.ctaDesc}>Crie sua conta em segundos — é de graça!</p>
          <button className={styles.ctaBtn} onClick={() => navigate('/register')}>
            quero entrar! <IconArrow />
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.logo} style={{ fontSize: '16px' }}>Task<em>Flow</em></span>
        <span className={styles.footerCopy}>@ 2026 TaskFlow. Todos os direitos reservados.</span>
      </footer>
    </div>
  )
}
