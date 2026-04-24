const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = data?.message || `Erro ${res.status}`
    throw new Error(msg)
  }

  return data
}

// Auth
export const authApi = {
  login: (email, senha) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  register: (nome, email, senha) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    }),
}

// Tarefas 
export const tarefaApi = {
  listar: () => request('/tarefa'),

  buscar: (id) => request(`/tarefa/${id}`),

  criar: (titulo, descricao) =>
    request('/tarefa', {
      method: 'POST',
      body: JSON.stringify({ titulo, descricao }),
    }),

  atualizar: (id, titulo, descricao, concluida) =>
    request(`/tarefa/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ titulo, descricao, concluida }),
    }),

  deletar: (id) =>
    request(`/tarefa/${id}`, { method: 'DELETE' }),
}

// Comentários
export const comentarioApi = {
  listar: (tarefaId) =>
    request(`/tarefas/${tarefaId}/comentarios`),

  criar: (tarefaId, conteudo) =>
    request(`/tarefas/${tarefaId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ conteudo }),
    }),

  deletar: (tarefaId, id) =>
    request(`/tarefas/${tarefaId}/comentarios/${id}`, {
      method: 'DELETE',
    }),
}
