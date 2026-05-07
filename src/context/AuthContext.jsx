import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Normaliza o objeto usuário independente do formato da API
function normalizeUser(userData) {
  if (!userData) return null
  return {
    id: userData.id ?? userData.Id,
    nome: userData.nome ?? userData.Nome ?? userData.name ?? userData.Name ?? 'Usuário',
    email: userData.email ?? userData.Email ?? '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const raw = localStorage.getItem('user')
    if (token && raw) {
      try { setUser(normalizeUser(JSON.parse(raw))) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  function login(token, userData) {
    const normalized = normalizeUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(normalized))
    setUser(normalized)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  function updateUser(userData) {
    const normalized = normalizeUser(userData)
    localStorage.setItem('user', JSON.stringify(normalized))
    setUser(normalized)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
