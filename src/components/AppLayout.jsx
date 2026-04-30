import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import styles from './AppLayout.module.css'

const IconGrid = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)
const IconList = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)
const IconMenu = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
)
const IconX = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)
const IconSun = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
)
const IconMoon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
)

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { isDark, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleLogout() { logout(); navigate('/') }

  const initials = user?.nome
    ? user.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U'

  const sidebarContent = (
    <>
      <div className={styles.brand}>
        <span className={`${styles.brandText} serif`}>Task<em>Flow</em></span>
        <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
          <IconX />
        </button>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user?.nome || 'Usuário'}</p>
          <p className={styles.userEmail}>{user?.email || ''}</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Menu</p>
        <NavLink to="/app" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
          <IconGrid /> Dashboard
        </NavLink>
        <NavLink to="/app/tarefas" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
          <IconList /> Tarefas
        </NavLink>
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.themeBtn} onClick={toggleTheme} title={isDark ? 'Tema claro' : 'Tema escuro'}>
          {isDark ? <IconSun /> : <IconMoon />}
          <span>{isDark ? 'Tema claro' : 'Tema escuro'}</span>
        </button>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <IconLogout /> Sair
        </button>
      </div>
    </>
  )

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <button className={styles.hamburger} onClick={() => setMenuOpen(true)}><IconMenu /></button>
        <span className={`${styles.topbarLogo} serif`}>Task<em>Flow</em></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className={styles.topbarTheme} onClick={toggleTheme}>
            {isDark ? <IconSun /> : <IconMoon />}
          </button>
          <div className={styles.topbarAvatar}>{initials}</div>
        </div>
      </header>

      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        {sidebarContent}
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
