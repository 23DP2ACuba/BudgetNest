# BudgetNest – Dokumentācija (Latviešu valodā)

## 1. Ievads

BudgetNest ir moderna budžetu pārvaldības lietotne, kurā ir iespējams sekot personālajiem un kopētajiem finansiem. Sistēma sastāv no divās galvenās daļām:

- **Backend** – Laravel API (PHP 8.4) ar MySQL datubāzi un Laravel Sanctum autentifikāciju
- **Frontend** – React + Vite lietotne ar Tailwind CSS un Recharts diagramām

## 2. Sistēmas prasības

Pirms sākšanas nodrošiniet, ka sistēmā ir instalēti:

- Docker un Docker Compose
- Vai atsevišķi: PHP 8.4+, Composer, Node.js 20+, MySQL 8.0

## 3. Uzstādīšana un palešana (Docker)

Visvieglojākais veids ir izmantot Docker Compose. No projekta saknes mapes palaidiet:

```bash
docker-compose up --build -d
```

Izslegs trīs konteinerus:

| Serviss | Ports | Apraksts |
|---------|-------|----------|
| `budgetnest-db` (MySQL 8.0) | 3306 | Datubāze |
| `budgetnest-backend` (Laravel API) | 8000 | Servera API |
| `budgetnest-frontend` (React SPA) | 5173 | Klienta lietotne |

Atveriet pārlūkā: `http://localhost:5173`

## 4. Darbība ar lietotni

### 4.1 Reģistrācija un pieteikšanās

1. Atveriet `http://localhost:5173`
2. Noklikšķiniet uz „Create account” (izveidot jaunu kontu)
3. Ievadiet vārdu, e-pastu un paroli (minimālā garums 8 simboli)
4. Pieteikieties ar saviem pieteikšanās dienām

### 4.2 Budžetu pārvaldība

- **Budžetu izveide:** Noklikšķiniet uz „Create Budget” un aizpildiet forma (nosaukums, apraksts, kopējā summa, sākuma un beigu datumi)
- **Budžetu apskatīšana:** Noklikšķiniet uz jebkura budžeta rīkā „View Details”
- **Budžeta rediģēšana:** Izmanto „Edit” pogu budžeta kartei
- **Budžeta dzēšana:** Izmanto „Delete” pogu (tikai budžeta ģenerators var dzēst)

### 4.3 Transakcijas

- **Jauna transakcija:** Noklikšķiniet uz „Add Transaction” un izvēlieties budžetu, kategoriju, tipu (ienākums/izdevums), summu un datumu
- **Rediģēšana:** Noklikšķiniet uz „Edit” ikonas transakcijas rindā
- **Dzēšana:** Noklikšķiniet uz „Delete” ikonas
- **Filtrēšana:** Izmanto filtrēšanas formu (tips, kategorija, datuma diapazons)

### 4.4 Budžetu koplietošana un biedru pārvaldība

- **Biedru uzaicināšana:** Budgeta detaļu lapā noklikšķiniet uz „+ Invite” un ievadiet biedra e-pastu un lomu (viewer, editor, owner)
- **Biedru noņemšana:** Noklikšķiniet uz „Remove” pogas biedra rindā (tiek jāatļaujas)
- **Atcelt budžetu (leave):** Ja esat biedrs, bet ne ģenerators, varat atcelt budžetu, noklikšķinot „Leave Budget”

### 4.5 Nekasamie uzašinājumi

Ja kāds ir uzaicinājis Jūs pie saviem budžetiem, redzēsiet „Pending Invitations” sadaļā Dashboard lapā. Varat pieņemt vai nogaidīt uzašinājumu.

### 4.6 Profila pārvaldība

- Profila informācijas rediģēšana (vārds, e-pasts)
- Parolesmaiņa (jānorāda pašreizējā parole)
- Konta dzēšana (jānorāda parole)

### 4.7 Administrators (admin loma)

Ja lietotajam ir `admin` loma, redzēsiet „Admin” pogu sākuma izvēlē. Administrators var:

- Skatīt statistiku (lietotāju, budžetu, transakciju skaits)
- Skatīt visus lietotājus
- Meklēt lietotājus pa vārdu vai e-pastu

## 5. API dokumentācija

Visi API pieprasījumi jāveic uz `http://localhost:8000/api`. Aizsargātie maršruti ir pieejami tikai pieteikušajiem lietotājiem, izmantojot Sanctum atslēgu.

### 5.1 Autentifikācija (publiskie maršruti)

| Metode | Maršruts | Apraksts |
|--------|---------|----------|
| POST | `/auth/register` | Jaunā lietotāja reģistrācija |
| POST | `/auth/login` | Pieteikšanās |

### 5.2 Pamatoperācijas (pieprasītajām pieeju tiesībām)

| Metode | Maršruts | Apraksts |
|--------|---------|----------|
| GET | `/budgets` | Budžetu saraksts |
| POST | `/budgets` | Jaunā budžeta izveide |
| GET | `/budgets/{id}` | Konkreta budžeta informācija |
| PUT | `/budgets/{id}` | Budžeta atjaunināšana |
| DELETE | `/budgets/{id}` | Budžeta dzēšana |
| POST | `/budgets/{id}/invite` | Biedra uzaicināšana |
| DELETE | `/budgets/{id}/members/{user}` | Biedra noņemšana |
| DELETE | `/budgets/{id}/leave` | Atcelt budžetu |
| GET | `/transactions` | Transakciju saraksts (lūgumu filtrējums) |
| POST | `/transactions` | Jaunas transakcijas izveide |
| GET | `/transactions/{id}` | Konkreta transakcija |
| PUT | `/transactions/{id}` | Transakcijas atjaunināšana |
| DELETE | `/transactions/{id}` | Transakcijas dzēšana |
| GET | `/budgets/{id}/transactions` | Konkrēta budžeta transakcijas |
| GET | `/categories` | Kategoriju saraksts |
| POST | `/categories` | Jaunas kategorijas izveide |
| GET | `/categories/{id}` | Konkrēta kategorija |
| PUT | `/categories/{id}` | Kategorijas atjaunināšana |
| DELETE | `/categories/{id}` | Kategorijas dzēšana |

### 5.3 Administrators (tikai admin loma)

| Metode | Maršruts | Apraksts |
|--------|---------|----------|
| GET | `/admin/dashboard` | Administrators statistika |
| GET | `/admin/users` | Visu lietotāju saraksts |

### 5.4 Profils

| Metode | Maršruts | Apraksts |
|--------|---------|----------|
| GET | `/auth/user` | Pašreizējā lietotāja profils |
| PUT | `/auth/profile` | Profila atjaunināšana |
| PUT | `/auth/password` | Paroles maiņa |
| DELETE | `/auth/profile` | Konta dzēšana |

## 6. Datubāzes schema

Sistēma izmanto sešas galvenās tabulas:

| Tabula | Apraksts |
|--------|----------|
| `users` | Lietotāji (vārds, e-pasts, parole, loma) |
| `budgets` | Budžeti (nosaukums, summa, datumi, ģenerators) |
| `budget_user` | Koplvērtība – budžeta biedri (budžets, lietotājs, loma, statuss) |
| `categories` | Kategorijas (nosaukums, ikona, krāsa, tips) |
| `transactions` | Transakcijas (budžets, kategorija, lietotājs, tips, summa, datums) |
| `personal_access_tokens` | Sanctum autentifikācijas atslēgas |

## 7. Valodas (i18n)

Lietotne atbalsta divas valodas:

- **English (EN)** – noklusējuma valoda
- **Latviešu (LV)** – latviešu valodā

Valodas maiņa ir pieejama sākuma izvēļē (Navbar) – noklikšķiniet uz karoga ikones (🇺🇸/🇱🇻) un izvēlēties nepieciešamo valodu.

## 8. Testēšana

Visu testu summu var palaidīt Docker konteinē:

```bash
docker-compose exec backend php artisan test
```

Ievietoti testi par:

| Tests | Apraksts |
|-------|----------|
| AuthTest | Reģistrācija, pieteikšanās, izrakstīšana, profils |
| BudgetTest | Budžetu CRUD un pieeju tiesības |
| TransactionTest | Transakciju CRUD, filtrējums, pieeju tiesības |
| CategoryTest | Kategoriju CRUD |
| AdminTest | Administrators statistika un lietotāji |
| InvitationTest | Uzašinājumi un biedru pārvaldība |
| Unit testu | Modeļu laukumi un attiecības |

## 9. Struktūra

```
BudgetNest/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── BudgetController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── InvitationController.php
│   │   │   ├── AdminController.php
│   │   │   └── ProfileController.php
│   │   ├── Models/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── factories/
│   │   │   └── seeders/
│   │   └── routes/api.php
│   ├── tests/
│   │   ├── Unit/
│   │   └── Feature/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/ (Landing, Login, Register, Dashboard, Transactions, Budgets, BudgetDetail, Profile)
│   │   ├── components/ (Sidebar, Navbar, Modal, Alert, TransactionList, BudgetCard, etc.)
│   │   ├── api/ (axios, auth, budgets, transactions, categories)
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useAuth.jsx, useTransactions.jsx, useBudgets.jsx
│   │   ├── i18n/ (locales/en.json, locales/lv.json)
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── DOKUMENTACIJA_LV.md
```

## 10. Džiļi

- Nevar dzēst budžetu, ja esat tikai biedrs, bet ne ģenerators
- Nevar noņemt budžeta ģeneratora no biedru saraksta
- Invitācijas var būt stāvā: `pending`, `accepted`, `declined`
- Transakcijas ir saistītas ar budžetu, kategoriju un lietotāju
- Visas pieprasījumi aizsargāti ar Sanctum autentifikāciju
- Dalījumi noņemami tikai budžeta ģeneratoram

## 11. Kontakti un atbalsts

Ja jums ir jautājumi vai problēmas, sazinieties ar projektā dalībniekiem vai atveriet kļūdas ziņojumu (issue) projektā.

---

*Dokumentācija sagatavota Latvijā, 2026. gada oktobrī.*  
*Versija: 1.0*