# BudgetNest

A collaborative budget management application built with Laravel and React.

## Project Structure

```
BudgetNest/
├── backend/          # Laravel 11 API
├── frontend/         # React + Vite + Tailwind CSS
└── docs/            # Documentation (optional)
```

## Features

- User authentication and authorization
- Budget creation and management
- Transaction tracking
- Collaborative budgets with role-based access
- Category management
- Admin dashboard
- Real-time budget analytics

## Tech Stack

### Backend
- Laravel 11
- PHP 8.5
- MySQL/SQLite
- Laravel Sanctum (API authentication)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

## Getting Started

### Prerequisites
- PHP 8.5+
- Composer
- Node.js 20+
- npm

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

The API runs on `http://localhost:8000/api` by default.

## License

MIT
