# TaskFlow — Frontend for ToDoList API

React + Vite interface for the .NET task management API.

## Prerequisites

- Node.js 18+
- .NET API running at `https://localhost:7001`

## Installation and Usage

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Access: **http://localhost:5173**

## API Configuration

The proxy is configured in `vite.config.js`. By default, all requests to `/api/*` are redirected to `https://localhost:7001`.

If your API runs on a different port, edit the `target` in `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'https://localhost:YOUR_PORT',
    changeOrigin: true,
    secure: false,
  },
},
```

## Structure

```
src/
├── context/
│   ├── AuthContext.jsx     # Authentication context (JWT)
│   └── ToastContext.jsx    # Toast notifications
├── services/
│   └── api.js              # API calls (auth, tasks, comments)
├── components/
│   ├── AppLayout.jsx       # Sidebar + main layout
│   └── TarefaModal.jsx     # Create/edit task modal
├── pages/
│   ├── LandingPage.jsx     # Public landing page
│   ├── LoginPage.jsx       # Login
│   ├── RegisterPage.jsx   # Sign up
│   ├── DashboardPage.jsx  # Dashboard with summary and statistics
│   ├── TarefasPage.jsx    # Task list with CRUD
│   └── TarefaDetailPage.jsx # Task details + comments
└── App.jsx                # Routing
```

## Routes

| Route              | Description           |
| ------------------ | --------------------- |
| `/`                | Landing page          |
| `/login`           | Login                 |
| `/register`        | Sign up               |
| `/app`             | Dashboard (protected) |
| `/app/tarefas`     | Tasks (protected)     |
| `/app/tarefas/:id` | Details (protected)   |


## Features

- ✅ Landing page with visual preview
- ✅ Sign up and login with JWT
- ✅ Dashboard with statistics and progress
- ✅ List, create, edit, and delete tasks
- ✅ Mark tasks as completed/pending
- ✅ Filter by status and search by text
- ✅ Task details with comments
- ✅ Add and delete comments
- ✅ Toast notifications
- ✅ Route protection via authentication
