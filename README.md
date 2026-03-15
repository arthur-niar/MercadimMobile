# Mercadim Mobile

Sistema de gestão de estoque e produtos para pequenos negócios.

## Tecnologias

### Frontend
- React Native (Expo)
- TypeScript
- NativeWind (Tailwind CSS)
- Axios

### Backend
- Node.js + Express
- TypeScript
- JWT
- bcrypt

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd mercadim-mobile
npm install
npm run android
```

## Credenciais de Teste

- Email: teste@mercadim.com
- Senha: senha123

## Estrutura

Arquitetura MVVM (Model-View-ViewModel)

```
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   ├── utils/
│   ├── config/
│   └── server.ts

mercadim-mobile/
├── src/
│   ├── app/              (Screens - Expo Router)
│   ├── views/            (UI Components)
│   ├── viewmodels/       (Business Logic)
│   ├── models/           (Data Models)
│   ├── services/         (API Services)
│   ├── components/       (Reusable Components)
│   └── utils/            (Utilities)
```

### Camadas

- Models: Definição de tipos e interfaces de dados
- ViewModels: Lógica de negócio e estado
- Views: Componentes de UI puros
- Screens (app/): Conectam Views com navegação

