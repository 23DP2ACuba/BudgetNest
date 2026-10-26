# BudgetNest API galapunkti

## 1. Pamatinformācija

- Bāzes URL lokālajā vidē: `http://localhost:8000/api`
- Datu formāts: JSON
- Autentifikācija: Laravel Sanctum personīgās piekļuves tokens; aizsargātajiem pieprasījumiem izmantojiet `Authorization: Bearer <token>`.
- Validācijas kļūdas parasti atgriež HTTP `422` ar `message` un `errors` laukiem.
- Tālāk norādītie maršruti balstīti `backend/routes/api.php` un kontrolieros. Piekļuves pārbaudes var atšķirties pa maršrutiem; pirms publiskas lietošanas pārbaudiet autorizāciju.

Piemēra pieprasījuma galvenes:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token>
```

## 2. Autentifikācija un profils

| Metode | Ceļš | Auth | Apraksts |
|---|---|---|---|
| `POST` | `/auth/register` | Nē | Reģistrē lietotāju un atgriež lietotāju ar tokenu (`201`). |
| `POST` | `/auth/login` | Nē | Autentificē lietotāju un atgriež lietotāju ar tokenu (`200`). |
| `POST` | `/auth/logout` | Jā | Dzēš pašreizējo piekļuves tokenu. |
| `GET` | `/auth/user` | Jā | Atgriež autentificētā lietotāja datus. |
| `PUT` | `/auth/profile` | Jā | Labo vārdu un/vai e-pastu. |
| `PUT` | `/auth/password` | Jā | Maina paroli, pārbaudot pašreizējo paroli. |
| `DELETE` | `/auth/profile` | Jā | Dzēš kontu, ja norādītā parole ir pareiza. |

### Reģistrācijas piemērs

```http
POST /api/auth/register
```

```json
{
  "name": "Anna Bērziņa",
  "email": "anna@example.com",
  "password": "parole1234",
  "password_confirmation": "parole1234"
}
```

Veiksmīga atbilde (`201`) satur `user` objektu un `token`. Loma jaunam kontam ir `user`.

### Pieteikšanās piemērs

```json
{
  "email": "anna@example.com",
  "password": "parole1234"
}
```

Nepareizi akreditācijas dati tiek atgriezti kā validācijas kļūda (`422`). Konta izveide prasa unikālu derīgu e-pastu un vismaz 8 rakstzīmju paroli.

### Profila pieprasījumi

Profila atjaunināšanas piemērs:

```json
{
  "name": "Anna Bērziņa",
  "email": "anna@example.com"
}
```

Paroles maiņas piemērs:

```json
{
  "current_password": "vecaParole123",
  "new_password": "jaunaParole123",
  "new_password_confirmation": "jaunaParole123"
}
```

Konta dzēšanai nosūtiet `DELETE /auth/profile` ar JSON saturu `{"password":"..."}`. Pirms dzēšanas lietotāja saskarnē nepieciešams skaidrs apstiprinājums.

## 3. Budžeti un dalībnieki

| Metode | Ceļš | Auth | Apraksts |
|---|---|---|---|
| `GET` | `/budgets` | Jā | Saraksta lietotāja izveidotos un lietotāja dalībā esošos budžetus. |
| `POST` | `/budgets` | Jā | Izveido budžetu; izveidotājs tiek pievienots kā īpašnieks (`201`). |
| `GET` | `/budgets/{budget}` | Jā | Apskata budžetu, dalībniekus un darījumus; piekļuve tiek pārbaudīta. |
| `PUT` | `/budgets/{budget}` | Jā | Labo budžetu; kontrolierī paredzēts izveidotājam vai īpašniekam. |
| `DELETE` | `/budgets/{budget}` | Jā | Dzēš budžetu; kontrolierī atļauts izveidotājam. |
| `POST` | `/budgets/{budget}/invite` | Jā | Uzaicina esošu lietotāju ar norādītu lomu. |
| `DELETE` | `/budgets/{budget}/members/{user}` | Jā | Noņem dalībnieku; atļauja pārbaudīta kontrolierī. |
| `DELETE` | `/budgets/{budget}/leave` | Jā | Autentificētais dalībnieks atstāj budžetu, ja nav tā izveidotājs. |

Budžeta izveides piemērs:

```json
{
  "name": "Mājsaimniecības budžets",
  "description": "Ikmēneša izdevumu plāns",
  "total_amount": 1500.00,
  "start_date": "2026-10-01",
  "end_date": "2026-10-31"
}
```

Beigu datumam jābūt vēlākam par sākuma datumu. Uzaicināšanas piemērs:

```json
{
  "email": "biedrs@example.com",
  "role": "viewer"
}
```

Atbalstītās lomas: `owner`, `editor`, `viewer`. Uzaicināšanas e-pastam jau jābūt reģistrētam sistēmā. Atkārtoti gaidošu vai jau pieņemtu uzaicinājumu nevar izveidot kā jaunu.

## 4. Uzaicinājumi

| Metode | Ceļš | Auth | Apraksts |
|---|---|---|---|
| `GET` | `/invitations` | Jā | Atgriež pašreizējā lietotāja gaidošos budžetu uzaicinājumus. |
| `POST` | `/invitations/{budget}/accept` | Jā | Pieņem gaidošu uzaicinājumu. |
| `POST` | `/invitations/{budget}/decline` | Jā | Noraida gaidošu uzaicinājumu. |

Pieņemšanas un noraidīšanas pieprasījumiem nav obligāta JSON satura. Budžeta identifikators URL ir budžeta ID, nevis atsevišķs uzaicinājuma ID. Neesošs uzaicinājums atgriež `404`, bet uzaicinājums, kas vairs nav `pending`, — `400`.

## 5. Darījumi

| Metode | Ceļš | Auth | Apraksts |
|---|---|---|---|
| `GET` | `/transactions` | Jā | Saraksta pieejamos darījumus; atbalsta filtrus un lapošanu (15 ieraksti lapā). |
| `POST` | `/transactions` | Jā | Izveido darījumu (`201`). |
| `GET` | `/transactions/{transaction}` | Jā | Apskata darījumu. |
| `PUT` | `/transactions/{transaction}` | Jā | Labo darījumu; kontrolieris pārbauda darījuma veidotāju vai budžeta izveidotāju. |
| `DELETE` | `/transactions/{transaction}` | Jā | Dzēš darījumu; kontrolieris pārbauda darījuma veidotāju vai budžeta izveidotāju. |
| `GET` | `/budgets/{budget}/transactions` | Jā | Saraksta konkrēta budžeta darījumus; atbalsta veida un kategorijas filtrus. |

`GET /transactions` vaicājuma parametri:

| Parametrs | Apraksts |
|---|---|
| `type` | `income` vai `expense` |
| `category_id` | Kategorijas ID |
| `start_date` | Iekļauj darījumus no datuma (ieskaitot) |
| `end_date` | Iekļauj darījumus līdz datumam (ieskaitot) |
| `page` | Lapas numurs Laravel lapotajam rezultātam |

Darījuma izveides piemērs:

```json
{
  "budget_id": 1,
  "category_id": 2,
  "type": "expense",
  "amount": 45.50,
  "description": "Pārtikas preces",
  "transaction_date": "2026-10-12"
}
```

Obligāti lauki: `budget_id`, `category_id`, `type`, `amount`, `transaction_date`. Summai jābūt vismaz `0.01`. Saraksta atbilde ir Laravel paginatora JSON objekts ar `data` masīvu un lapošanas metadatiem.

## 6. Kategorijas

`Route::apiResource('categories', ...)` izveido šādus autentificētus maršrutus:

| Metode | Ceļš | Apraksts |
|---|---|---|
| `GET` | `/categories` | Visas kategorijas. |
| `POST` | `/categories` | Izveido kategoriju (`201`). |
| `GET` | `/categories/{category}` | Viena kategorija. |
| `PUT/PATCH` | `/categories/{category}` | Labo kategoriju. |
| `DELETE` | `/categories/{category}` | Dzēš kategoriju. |

Kategorijas piemērs:

```json
{
  "name": "Pārtika",
  "icon": "basket",
  "color": "#22AA88",
  "type": "expense"
}
```

`name` un `type` ir obligāti, `type` vērtība ir `income` vai `expense`; `icon` un `color` nav obligāti. Maršruti ir autentificēti, taču kontrolierī nav redzama lomu pārbaude — piekļuves politiku pirms lietošanas jāpārskata.

## 7. Administratora API

| Metode | Ceļš | Auth | Apraksts |
|---|---|---|---|
| `GET` | `/admin/dashboard` | Jā, `admin` | Atgriež lietotāju, budžetu un darījumu skaitu, kā arī jaunākos lietotājus/budžetus. |
| `GET` | `/admin/users` | Jā, `admin` | Atgriež lapotu lietotāju sarakstu; atbalsta `search` parametru. |

Lietotāju sarakstā tiek izmantota 15 ierakstu lapa. `search` meklē pēc vārda vai e-pasta. Administratora lomu pārbauda middleware; neatļautam lietotājam pieprasījums jāatsaka.

## 8. Biežākie HTTP statusi

| Statuss | Nozīme |
|---|---|
| `200` | Pieprasījums izpildīts |
| `201` | Resurss izveidots |
| `400` | Darbība nav derīga pašreizējam resursa stāvoklim |
| `401` | Trūkst derīgas autentifikācijas |
| `403` | Autentificētajam lietotājam darbība nav atļauta |
| `404` | Resurss nav atrasts |
| `422` | Ievades validācija neizturēta |

## 9. Klienta pieprasījumu piemēri

Budžetu saraksts ar tokenu:

```bash
curl -H "Accept: application/json" -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/budgets
```

Darījumu filtrēšana:

```bash
curl -H "Accept: application/json" -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/transactions?type=expense&start_date=2026-10-01&end_date=2026-10-31"
```

Piemēri ir lokālai izstrādei; nekad neievietojiet reālus tokenus dokumentācijā vai repozitorijā.
