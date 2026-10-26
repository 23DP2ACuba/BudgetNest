# Run BudgetNest locally

## Prerequisites

- PHP 8.3 or newer, with PDO SQLite enabled
- Composer
- Node.js 20.19+ or 22.12+, with npm
- Git

Run the API and frontend in separate terminals. The backend uses SQLite by
default; no separate database server is needed.

## Windows (PowerShell)

Clone the repository:

```powershell
git clone https://github.com/23DP2ACuba/BudgetNest.git
Set-Location BudgetNest
```

In the first terminal, install and start the backend:

```powershell
Set-Location backend
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path database\database.sqlite)) {
    New-Item -ItemType File -Path database\database.sqlite | Out-Null
}
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

In a second terminal, from the repository root, install and start the frontend:

```powershell
Set-Location frontend
npm ci
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Open <http://localhost:5173>. The API is available at
<http://localhost:8000/api>.

## macOS and Linux

Clone the repository:

```bash
git clone https://github.com/23DP2ACuba/BudgetNest.git
cd BudgetNest
```

In the first terminal, install and start the backend:

```bash
cd backend
composer install
if [ ! -f .env ]; then cp .env.example .env; fi
if [ ! -f database/database.sqlite ]; then touch database/database.sqlite; fi
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

In a second terminal, from the repository root, install and start the frontend:

```bash
cd frontend
npm ci
if [ ! -f .env.local ]; then cp .env.example .env.local; fi
npm run dev
```

Open <http://localhost:5173>. The API is available at
<http://localhost:8000/api>.

## Run backend tests

From the repository root:

```bash
cd backend
php artisan test
```

To run only the unit tests:

```bash
php artisan test --testsuite=Unit
```

The test configuration uses an in-memory SQLite database, so the PHP PDO SQLite
extension must be enabled even though the regular local database is a file.

## Seeded local accounts

`php artisan migrate --seed` adds sample accounts and categories, including the
admin account. If you migrated without seeding, create the admin account by
running this from the `backend` directory:

```sh
php artisan db:seed --class=AdminUserSeeder
```

The seeded admin login is `admin@budgetnest.com` with password `admin123`.
The seeder is safe to rerun; it will not overwrite an existing account. These
publicly visible default credentials are for local development only. Change
them before using any shared or production environment.
