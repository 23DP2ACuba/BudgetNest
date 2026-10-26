# BudgetNest testēšanas plāns

## 1. Mērķis

Pārbaudīt, ka BudgetNest API un lietotāja saskarne atbilst prasību specifikācijai, dati tiek validēti un saglabāti pareizi, un lietotājs nevar piekļūt citu lietotāju datiem bez atļaujas.

Plāns nosaka paredzētās pārbaudes. Tas nav testu izpildes ziņojums: rezultātus atzīmējiet tikai pēc reālas izpildes, pievienojot izpildes datumu, versiju un pierādījumus.

## 2. Tvērums

### Iekļauts

- Reģistrācija, pieteikšanās, tokena autentifikācija un izrakstīšanās.
- Profila atjaunināšana, paroles maiņa un konta dzēšana API līmenī.
- Budžetu CRUD, piekļuves pārbaudes un datumu/summu validācija.
- Budžeta dalība, uzaicinājumi, pieņemšana, noraidīšana, dalībnieka noņemšana un aiziešana.
- Darījumu CRUD, filtri, lapošana, datu validācija un lomu/piederības pārbaudes.
- Kategoriju CRUD un piekļuves politika.
- Administratora API un `admin` lomas pārbaude.
- React galvenās lietotāja plūsmas, ja attiecīgais skats ir ieviests.
- Lokālās palaišanas instrukcijas izpildāmība.

### Ārpus tvēruma, ja vien nav atsevišķi saskaņots

- Ārējo banku integrācijas un maksājumu apstrāde.
- Ražošanas veiktspējas slodzes testi bez definētas vides un slodzes profila.
- Drošības sertifikācija vai penetrācijas tests; parastie lietotnes testi tos neaizstāj.

## 3. Testēšanas pieeja un veidi

| Veids | Mērķis | Piemēri |
|---|---|---|
| Vienību testi | Pārbaudīt izolētu biznesa loģiku | Validācijas noteikumi, modeļu palīgmetodes, ja tādas ir |
| API/feature testi | Pārbaudīt pilnu HTTP maršrutu, validāciju un atbildi | Reģistrācija, budžeta CRUD, darījumu filtri |
| Integrācijas testi | Pārbaudīt saistīto moduļu darbību un datubāzes attiecības | Uzaicinājuma pieņemšana un budžeta dalības atjaunošana |
| Autorizācijas testi | Pārbaudīt, ko drīkst/nevar darīt katra loma | Viesis, nesaistīts lietotājs, skatītājs, redaktors, īpašnieks, administrators |
| UI/manuālie testi | Pārbaudīt redzamo lietotāja plūsmu un kļūdu stāvokļus | Forma, filtri, apstiprinājuma dialogs, tukšs saraksts |
| Regresijas testi | Pārliecināties, ka labojums nesalauž jau strādājošu darbību | Atkārtoti palaist saistītos feature testus pēc izmaiņām |
| Instalācijas pārbaude | Apstiprināt reproducējamu lokālo iestatīšanu | Izpildīt `LOCAL_SETUP.md` jaunā vidē |

## 4. Vide un priekšnosacījumi

- PHP 8.3+ un PDO SQLite paplašinājums, Composer.
- Node.js 20.19+ vai 22.12+ un npm.
- Backend testiem: `backend/` direktorijā `php artisan test`; testa konfigurācija izmanto SQLite in-memory datubāzi.
- Manuālai pārbaudei: palaižams Laravel API un frontend, svaigi testa konti un atsevišķi lietotāji katrai lomai.
- Testa dati nedrīkst saturēt reālus personu vai finanšu datus.
- Pirms katra izpildes cikla reģistrē: commit/versiju, vidi, datumu, pārlūku, datubāzes draiveri un izpildītāju.

Lokālās palaišanas soļi ir [`LOCAL_SETUP.md`](../LOCAL_SETUP.md). Pašreizējie backend testi atrodas `backend/tests/Feature/` un `backend/tests/Unit/`.

## 5. Testa dati

Sagatavojiet izolētus testa ierakstus:

- `U1`: parasts lietotājs un budžeta `B1` izveidotājs/īpašnieks;
- `U2`: `B1` redaktors;
- `U3`: `B1` skatītājs;
- `U4`: nesaistīts parasts lietotājs;
- `A1`: administrators;
- `B1`: derīgs budžets ar sākuma/beigu datumiem;
- `C1`: izdevumu kategorija, `C2`: ienākumu kategorija;
- darījumi ar ienākumu/izdevumu veidiem, vairākām kategorijām un datumiem pirms, robežās un pēc filtra intervāla.

Katram testam jābūt atkārtojamam un neatkarīgam no iepriekšējā testa datiem.

## 6. Scenāriji un testa gadījumi

Statusa lauku testa izpildes laikā aizpilda kā `Nav izpildīts`, `Izturēts` vai `Neizturēts`.

| ID | Prasība | Scenārijs / darbības | Sagaidāmais rezultāts | Veids | Statuss |
|---|---|---|---|---|---|
| TC-AUTH-01 | FR-01 | Reģistrēt kontu ar unikālu e-pastu, derīgu paroli un apstiprinājumu | `201`; atbilde satur lietotāju un tokenu | Pozitīvs/API | Nav izpildīts |
| TC-AUTH-02 | FR-01 | Reģistrēt ar jau izmantotu e-pastu | `422`; e-pasta validācijas kļūda | Negatīvs/API | Nav izpildīts |
| TC-AUTH-03 | FR-01 | Reģistrēt bez paroles apstiprinājuma vai ar <8 rakstzīmēm | `422`; lietotājs netiek izveidots | Robež/API | Nav izpildīts |
| TC-AUTH-04 | FR-02 | Pieteikties ar pareizu e-pastu un paroli | `200`; tokena un lietotāja objekts | Pozitīvs/API | Nav izpildīts |
| TC-AUTH-05 | FR-02 | Pieteikties ar nepareizu paroli | `422`; nav tokena | Negatīvs/API | Nav izpildīts |
| TC-AUTH-06 | FR-03 | Izsaukt `GET /auth/user` bez tokena un ar derīgu tokenu | Bez tokena `401`; ar derīgu tokenu `200` un tikai pašreizējais lietotājs | Autorizācija/API | Nav izpildīts |
| TC-BUD-01 | FR-04 | Izveidot budžetu ar derīgiem laukiem | `201`; saglabāts budžets un izveidotāja īpašnieka dalība | Pozitīvs/API | Nav izpildīts |
| TC-BUD-02 | FR-04 | Izveidot budžetu ar negatīvu summu vai beigu datumu pirms sākuma | `422`; budžets netiek izveidots | Negatīvs/robež/API | Nav izpildīts |
| TC-BUD-03 | FR-05 | U1 uzskaita savus budžetus; U4 mēģina apskatīt B1 | U1 redz B1; U4 saņem `403` | Autorizācija/API | Nav izpildīts |
| TC-BUD-04 | FR-06 | U1 labo/dzēš B1; U4 mēģina to pašu | Īpašnieka darbība izdodas; U4 tiek atteikts | Autorizācija/API | Nav izpildīts |
| TC-BUD-05 | FR-12 | B1 izveidotājs mēģina aiziet; dalībnieks aiziet | Izveidotājam `400`; dalībniekam dalība tiek noņemta | Negatīvs/API | Nav izpildīts |
| TC-INV-01 | FR-10 | Budžeta īpašnieks uzaicina esošu lietotāju ar katru derīgo lomu | Uzaicinājums izveidots ar `pending` statusu un norādīto lomu | Pozitīvs/API | Nav izpildīts |
| TC-INV-02 | FR-10 | Uzaicināt neesošu e-pastu vai ar nederīgu lomu | `422`; uzaicinājums netiek izveidots | Negatīvs/API | Nav izpildīts |
| TC-INV-03 | FR-11 | Uzaicinātais pieņem un citā testā noraida gaidošu uzaicinājumu | Statuss kļūst attiecīgi `accepted` vai `declined`; uzaicinājums pazūd no gaidošo saraksta | Integrācija/API | Nav izpildīts |
| TC-INV-04 | FR-11 | Pieņemt neesošu vai jau apstrādātu uzaicinājumu | Attiecīgi `404` vai `400`; stāvoklis nemainās | Negatīvs/API | Nav izpildīts |
| TC-TR-01 | FR-07 | Izveidot ienākuma un izdevuma darījumu ar derīgu budžetu/kategoriju | `201`; summa, veids, datums un izveidotājs saglabājas | Pozitīvs/API | Nav izpildīts |
| TC-TR-02 | FR-07 | Izveidot darījumu ar summu 0, nezināmu kategoriju vai nederīgu veidu | `422`; ieraksts netiek izveidots | Negatīvs/robež/API | Nav izpildīts |
| TC-TR-03 | FR-08 | Filtrēt pēc `type`, `category_id`, `start_date`/`end_date` un lapas | Atgriežas tikai kritērijiem atbilstošie ieraksti; lapošana darbojas | API | Nav izpildīts |
| TC-TR-04 | FR-09 | Nesaistīts lietotājs mēģina apskatīt, labot un dzēst citu darījumu | Neatļauts pieprasījums tiek atteikts; dati nemainās | Autorizācija/API | Nav izpildīts |
| TC-TR-05 | FR-09 | Skatītājs un redaktors mēģina izveidot/labot darījumu | Uzvedība atbilst apstiprinātajai lomu politikai | Autorizācija/API | Nav izpildīts |
| TC-CAT-01 | FR-13 | Izveidot kategoriju ar derīgu nosaukumu un veidu | `201`; kategorija pieejama sarakstā | API | Nav izpildīts |
| TC-CAT-02 | FR-13 | Pārbaudīt anonīma/lietotāja/admin piekļuvi kategoriju CRUD | Rezultāts atbilst apstiprinātajai kategoriju piekļuves politikai | Autorizācija/API | Nav izpildīts |
| TC-PROF-01 | FR-14 | Mainīt vārdu/e-pastu un paroli ar pareizu pašreizējo paroli | Izmaiņas saglabājas; parole tiek pieņemta tikai ar apstiprinājumu | Pozitīvs/API | Nav izpildīts |
| TC-PROF-02 | FR-14 | Mainīt paroli ar nepareizu pašreizējo paroli vai nesakrītošu apstiprinājumu | `422`; parole nemainās | Negatīvs/API | Nav izpildīts |
| TC-ADM-01 | FR-16 | U4 un A1 pieprasa `/admin/dashboard` un `/admin/users` | U4 aizliegts; A1 saņem kopsavilkumu/lapotu sarakstu | Lomu/API | Nav izpildīts |
| TC-UI-01 | FR-17 | Pārbaudīt login, register, budgets un admin skatus pārlūkā | Funkcijas ir pieejamas, kļūdas skaidras; sagataves jāreģistrē kā defekts/ierobežojums | Manuāls/UI | Nav izpildīts |
| TC-UI-02 | FR-17/18 | Pievienot, labot, filtrēt un dzēst darījumu; pārbaudīt paneli | UI atspoguļo backend saglabātos datus un kļūdu stāvokļus | Manuāls/UI | Nav izpildīts |
| TC-SETUP-01 | NFR-06 | Izpildīt lokālās palaišanas instrukciju svaigā darba kopijā | Abi servisi palaižas; pieejami dokumentētajos URL | Instalācija | Nav izpildīts |

## 7. Izpildes secība un prioritātes

1. **P0 — kritiski:** autentifikācija, datu validācija, piekļuves tiesību matrica, budžetu/darījumu izolācija.
2. **P1 — galvenā funkcionalitāte:** budžetu un darījumu CRUD, uzaicinājumi, profila izmaiņas, lapošana/filtri.
3. **P2 — saskarne un administrēšana:** UI plūsmas, administratora skati, tukšie/kļūdu stāvokļi un diagrammu dati.
4. **P3 — nodošana:** svaigas vides uzstādīšana, regresijas komplekts un dokumentācijas pārbaude.

Pirms katra laidiena atkārtojiet visus P0, izlaboto defektu atkārtotās pārbaudes un ar izmaiņām saistītos regresijas testus.

## 8. Defektu vadība un rezultātu reģistrēšana

Defekta ierakstā norādiet ID, nosaukumu, nopietnību, vidi/versiju, priekšnosacījumus, atkārtošanas soļus, sagaidāmo un faktisko rezultātu, pierādījumu, atbildīgo un statusu. Pēc labošanas pievienojiet labojuma versiju un atkārtotās pārbaudes rezultātu.

| Izpildes datums | Versija/commit | Testa ID | Izpildītājs | Rezultāts | Pierādījuma/defekta saite |
|---|---|---|---|---|---|
| — | — | — | — | Nav izpildīts | — |

## 9. Pabeigšanas kritēriji

- Visi P0 testi izturēti un kritiskiem/augstas prioritātes defektiem ir atrisināts statuss.
- Neveiksmīgie testi ir dokumentēti; labotie defekti pārbaudīti atkārtoti.
- Katras API grupas autorizācija pārbaudīta viesim, nesaistītam lietotājam un attiecīgajām lomām.
- UI pārbaudīts tikai tiem skatiem, kas patiešām ieviesti; nepabeigtās funkcijas uzskaitītas.
- Testu žurnāls un atskaite balstās izpildes pierādījumos, nevis plānā.
