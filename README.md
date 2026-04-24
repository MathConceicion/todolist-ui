# TaskFlow — Frontend para ToDoList API

Interface React + Vite para a API .NET de gerenciamento de tarefas.

## Pré-requisitos

- Node.js 18+
- API .NET rodando em `https://localhost:7001`

## Instalação e uso

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

## Configuração da API

O proxy está configurado em `vite.config.js`. Por padrão, todas as requisições para `/api/*` são redirecionadas para `https://localhost:7001`.

Se sua API rodar em outra porta, edite o `target` em `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'https://localhost:SUA_PORTA',
    changeOrigin: true,
    secure: false,
  },
},
```

## Estrutura

```
src/
├── context/
│   ├── AuthContext.jsx     # Contexto de autenticação (JWT)
│   └── ToastContext.jsx    # Notificações toast
├── services/
│   └── api.js              # Chamadas à API (auth, tarefas, comentários)
├── components/
│   ├── AppLayout.jsx       # Sidebar + layout principal
│   └── TarefaModal.jsx     # Modal de criar/editar tarefa
├── pages/
│   ├── LandingPage.jsx     # Página inicial pública
│   ├── LoginPage.jsx       # Login
│   ├── RegisterPage.jsx    # Cadastro
│   ├── DashboardPage.jsx   # Painel com resumo e estatísticas
│   ├── TarefasPage.jsx     # Lista de tarefas com CRUD
│   └── TarefaDetailPage.jsx # Detalhe da tarefa + comentários
└── App.jsx                 # Roteamento
```

## Rotas

| Rota              | Descrição              |
|-------------------|------------------------|
| `/`               | Landing page           |
| `/login`          | Login                  |
| `/register`       | Cadastro               |
| `/app`            | Dashboard (protegida)  |
| `/app/tarefas`    | Tarefas (protegida)    |
| `/app/tarefas/:id`| Detalhe (protegida)    |

## Funcionalidades

- ✅ Landing page com preview visual
- ✅ Cadastro e login com JWT
- ✅ Dashboard com estatísticas e progresso
- ✅ Listar, criar, editar e excluir tarefas
- ✅ Marcar tarefa como concluída/pendente
- ✅ Filtro por status e busca por texto
- ✅ Detalhe da tarefa com comentários
- ✅ Adicionar e excluir comentários
- ✅ Notificações toast
- ✅ Proteção de rotas por autenticação
