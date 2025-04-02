# AuthFlow

Um sistema moderno de autenticação JWT com interface elegante e código limpo.

> Base completa para autenticação usando JWT (JSON Web Tokens), construída com tecnologias modernas e boas práticas de desenvolvimento.

## 🚀 Tecnologias

### Frontend

- React + TypeScript
- Vite
- Chakra UI (Design System)
- React Router DOM (Roteamento)
- React Hook Form (Gerenciamento de formulários)
- Axios (Cliente HTTP)

### Backend

- Node.js + TypeScript
- Express
- Prisma (ORM)
- JWT (Autenticação)
- BCrypt (Hash de senhas)

## ✨ Funcionalidades

- 🔐 Sistema completo de autenticação
  - Login
  - Registro
  - Proteção de rotas
  - Refresh Token
  - Logout
- 👥 Gerenciamento de usuários
  - Listagem de usuários
  - Dados persistidos no banco
- 🎨 Interface moderna e responsiva
  - Design clean e minimalista
  - Suporte a tema claro/escuro
  - Feedback visual para todas as ações
  - Validação de formulários
  - Loading states
  - Tratamento de erros

## 🚦 Rotas da API

### Públicas

- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/refresh-token` - Renovação do token de acesso

### Protegidas

- `GET /auth/users` - Lista todos os usuários (requer autenticação)

## 🛠️ Como executar

### Pré-requisitos

- Node.js
- PostgreSQL

### Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrations
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

### Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

## 🔒 Segurança

- Senhas armazenadas com hash usando BCrypt
- Tokens JWT com expiração
- Sistema de refresh token
- Proteção contra CSRF
- Validações no frontend e backend
- Sanitização de inputs

## 🎯 Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── types/
│   ├── prisma/
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── types/
    └── package.json
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) primeiro.

## 📫 Contato

Se você tiver alguma dúvida ou sugestão, por favor abra uma issue ou envie um pull request.

---

⭐️ Se este projeto te ajudou, considere dar uma estrela!
# auth-flow
# auth-flow
