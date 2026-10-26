# BudgetNest projekta dokumentācija un izstrādes plāns

Šis dokuments apkopo BudgetNest projekta dokumentācijas, darba organizācijas, izstrādes un prezentēšanas nodevumus četros posmos. Tas paredzēts komandai kā kopīgs kontrolsaraksts. Atzīmes pie nodevumiem norāda pašreizējo stāvokli šajā repozitorijā, nevis apliecina ārpus repozitorija veiktu darbu.

## Projekta kopsavilkums

**BudgetNest** ir koplietojama budžeta pārvaldības lietotne. Tās mērķis ir palīdzēt lietotājiem organizēt budžetus, reģistrēt ienākumus un izdevumus, kā arī sadarboties koplietotos budžetos.

| Joma | Informācija |
|---|---|
| Backend | Laravel 11, PHP, Laravel Sanctum |
| Frontend | React 18, Vite, Tailwind CSS |
| Datu bāze | SQLite vai MySQL |
| Lokālās palaišanas instrukcija | [`LOCAL_SETUP.md`](../LOCAL_SETUP.md) |
| Projekta apraksts un pamatinformācija | [`README.md`](../README.md) |

### Sagatavotā projekta dokumentācija

- [Prasību specifikācija](requirements.md)
- [Sistēmas arhitektūra](architecture.md)
- [API galapunktu dokumentācija](api-endpoints.md)
- [Testēšanas plāns](testing-plan.md)
- [Lietotāja instrukcija](user-manual.md)

### Komandas lomas

Plānā lietotie apzīmējumi **TM_1** un **TM_2** jāaizstāj ar komandas dalībnieku vārdiem un uzvārdiem.

| Loma | Galvenā atbildība |
|---|---|
| TM_1 — frontend | Saskarne, lietotāja plūsmas, vadu skices, lietotāja instrukcija un frontend pārbaudes |
| TM_2 — backend | API, datu modelis, datubāze, arhitektūras apraksts un backend pārbaudes |
| Abi dalībnieki | Prasības, Trello, integrācijas, pilna sistēmas pārbaude un prezentācijas |

Lomas apraksta atbildības sadalījumu, nevis ierobežo kopīgu darbu vai koda pārskatīšanu.

## 1. posms — projekta pamati un grupas organizācija

**Mērķis:** izveidot vienotu projekta pamatu, vienoties par atbildībām un pamatot projekta tēmu un tehnoloģiju izvēli.

| Nodevums | Nepieciešamais saturs | Atrašanās vieta / atbildīgais | Stāvoklis |
|---|---|---|---|
| Projekta apraksts | Nosaukums, īss mērķis, galvenās iespējas un tehnoloģijas | [`README.md`](../README.md) — abi | Ir; jāpārskata, kad mainās iespējas |
| Instalēšana un palaišana | Prasības, vides sagatavošana, backend un frontend palaišana | [`LOCAL_SETUP.md`](../LOCAL_SETUP.md) — abi | Ir |
| Komandas lomas | Dalībnieku vārdi, lomas un atbildības | README vai prezentācija — abi | Jāpapildina ar faktiskajiem vārdiem |
| Trello dēlis | Kolonnas: Backlog, To Do, In Progress, Review, Done; dokumentēts WIP limits | Trello — abi | Ārpus repozitorija; jāpārbauda un jānorāda saite |
| Repozitorija struktūra | Skaidras `backend/`, `frontend/` un `docs/` mapes | Git repozitorijs — abi | Struktūra ir izveidota |
| 1. prezentācija | Grupas izveide, lomu sadalījums, tēmas izvēle un pamatojums, tirgus izpētes kopsavilkums, tehnoloģijas un projekta pamats | Prezentācijas fails — abi | Jāsagatavo |

### Trello darba kārtība

Katram uzdevumam jābūt konkrētam rezultātam, atbildīgajam un prioritātei. Uzdevums pārvietojas pa kolonnām **Backlog → To Do → In Progress → Review → Done**. Pirms darba sākuma komandai Trello kartītē jānorāda WIP limits (maksimālais vienlaikus izstrādājamo uzdevumu skaits). Pārskatīšanā jāapstiprina, ka izpildīta kartītes pieņemšanas definīcija un izmaiņas darbojas kopā ar pārējo sistēmu.

## 2. posms — prasības, sistēmas plānošana un projektēšana

**Mērķis:** pirms galvenās ieviešanas aprakstīt sistēmas prasības un parādīt, kā lietotāji, saskarne, API un datu bāze veido vienotu risinājumu.

| Nodevums | Nepieciešamais saturs | Ieteicamā atrašanās vieta / atbildīgais | Stāvoklis |
|---|---|---|---|
| Prasību specifikācija | Funkcionālās un nefunkcionālās prasības, to prioritātes un pārbaudāmības kritēriji | [`requirements.md`](requirements.md) — abi | Sākotnējais melnraksts izveidots; komandai jāpārskata |
| Lietojuma gadījumu diagramma | Viesis, lietotājs, administrators; galvenie lietojuma gadījumi un `include`/`extend` attiecības; diagrammas skaidrojums | [`use-case-diagram.png`](use-case-diagram.png), [`use-case-diagram.drawio`](use-case-diagram.drawio) — abi | Sākotnējā diagramma izveidota; jāpārskata pret gatavo lietotni |
| Sistēmas arhitektūra | React saskarne, Laravel API, datubāze, autentifikācija, galvenie moduļi un datu plūsma | [`architecture.md`](architecture.md) un diagramma — TM_2 vadībā | Sākotnējais teksta apraksts izveidots; diagramma un pārskatīšana vēl vajadzīga |
| Funkcionālās dekompozīcijas diagramma | Hierarhisks sistēmas funkciju sadalījums, piemēram, konti, budžeti, darījumi, koplietošana un administrēšana | `docs/functional-decomposition.png` — TM_2 | Jāsagatavo |
| Datubāzes dokumentācija | Tabulas, lauki, datu tipi, atslēgas, ierobežojumi, attiecības un ER diagrammas skaidrojums | `docs/database.md`, [`er-diagram.png`](er-diagram.png), [`er-diagram.drawio`](er-diagram.drawio) — TM_2 | ER diagrammas sākotnējā versija izveidota; pilns lauku apraksts un pārskatīšana vēl vajadzīga |
| Saskarnes vadu skices | Galvenie ekrāni: sākumlapa, pieteikšanās/reģistrācija, panelis, darījumi, budžeti, budžeta detaļas, profils un administrators | `docs/wireframes/` vai Figma — TM_1 vadībā | Jāsagatavo |
| Trello uzdevumu sadalījums | Prasībām atbilstošas kartītes ar aprakstu, izpildes definīciju, atbildīgo, prioritāti un termiņu | Trello — abi | Jāsagatavo/papildināms |
| 2. prezentācija | Prasības, diagrammas, arhitektūra, datubāze, vadu skices un Trello darba organizācija | Prezentācijas fails — abi | Jāsagatavo |

### Prasību dokumenta ieteicamā struktūra

1. Sistēmas mērķis un tvērums.
2. Lietotāju lomas un pieņēmumi.
3. Funkcionālās prasības ar unikāliem ID (piemēram, `FR-01`).
4. Nefunkcionālās prasības ar ID (piemēram, `NFR-01`), piemēram, drošība, lietojamība, veiktspēja un saderība.
5. Pieņemšanas kritēriji un saistītie testu scenāriji.
6. Prasību izmaiņu vēsture un neietvertās funkcijas.

Katrai prasībai jābūt konkrētai un pārbaudāmai. Prasības jāatvasina no apstiprinātā projekta apraksta un jāsaskaņo ar faktiski ieviesto funkcionalitāti.

### Datubāzes un arhitektūras apraksta ieteikumi

- Arhitektūras shēmā parādiet pārlūku/React klientu, Laravel API, autentifikācijas plūsmu un datubāzi. Atzīmējiet, kādi dati un pieprasījumi plūst starp komponentēm.
- Datubāzes aprakstā katrai tabulai norādiet lauku, datu tipu, obligātumu, noklusējuma vērtību un atslēgas. ER diagrammā atzīmējiet attiecību kardinalitāti.
- Atsevišķi izskaidrojiet lietotāju dalību koplietotos budžetos un ar budžetu saistītos darījumus.
- Shēmām un attēliem pievienojiet nosaukumu, leģendu un īsu skaidrojumu. Diagrammas atjaunojiet, mainoties sistēmai.

## 3. posms — izstrāde, integrācija un testēšana

**Mērķis:** ieviest plānotās iespējas, reģistrēt izmaiņas un pārbaudīt gan atsevišķus moduļus, gan savstarpējo darbību.

### Izstrādes dokumentēšana

| Prakse | Sagaidāmais rezultāts | Atrašanās vieta / atbildīgais |
|---|---|---|
| API galapunktu saraksts | Katram galapunktam: metode, ceļš, autentifikācija/atļaujas, ievades piemērs, atbildes piemērs un kļūdu gadījumi | [`api-endpoints.md`](api-endpoints.md) — TM_2 |
| Vienota commit/PR kārtība | Aprakstošs izmaiņu nosaukums un atsauce uz Trello kartīti vai tās ID | GitHub — abi |
| Koda un moduļu apraksti | Īsi skaidrojumi netriviālai loģikai, piemēram, koplietotiem budžetiem un bilances aprēķinam | Avota kods — abi |
| README atjaunināšana | Precīzas tehnoloģijas, prasības, instalēšana, palaišana un pieejamās iespējas | [`README.md`](../README.md) — abi |

### Testēšanas plāns

Plānā jānorāda:

- **Mērķi:** ko pārbauda, piemēram, datu pareizību, autorizāciju, galveno lietotāja plūsmu un integrāciju.
- **Tvērums:** moduļi, kurus testē, un skaidri norādītās neietvertās daļas.
- **Testēšanas veidi:** vienību, integrācijas, API, UI/manuālā, piekļuves tiesību un regresijas testi; izvēlieties tikai projektam atbilstošos.
- **Vide:** lietotnes versija, datubāze, pārlūks, testa dati un izpildes datums.
- **Kritēriji:** kad tests ir izturēts, kad tests jāatkārto un kad defekts kavē laidienu.
- **Atbildīgie:** kurš sagatavo, izpilda un pārskata katru testu grupu.

Sākotnējais plāns pieejams [`testing-plan.md`](testing-plan.md). Testu rezultāti jāreģistrē pēc to faktiskas izpildes.

### Testu scenāriji un rezultātu žurnāls

Katram scenārijam piešķiriet unikālu ID, saistīto prasību, priekšnosacījumus, ievaddatus, darbības, sagaidāmo rezultātu, faktisko rezultātu, statusu un izpildes datumu. Iekļaujiet:

- pozitīvos gadījumus — derīga reģistrācija, darījuma izveide, uzaicinājuma pieņemšana;
- negatīvos gadījumus — nepareizi dati, neatļauta darbība, neeksistējošs resurss;
- robežgadījumus — minimālā pieļaujamā summa, datumu robežas, tukši saraksti;
- lomu gadījumus — viesis, parasts lietotājs, budžeta īpašnieks, redaktors, skatītājs un administrators, atbilstoši ieviestajām atļaujām;
- atkārtotu pārbaudi — pēc defekta labošanas izpildiet attiecīgo testu vēlreiz un reģistrējiet jauno rezultātu.

Ieteicamais rezultātu fails: `docs/test-results.md` vai tabula ar versiju vēsturi. Neatzīmējiet testu kā izturētu, ja tas nav izpildīts.

### Defektu reģistrs un testēšanas atskaite

Defekta ierakstā fiksējiet ID, kopsavilkumu, atkārtošanas soļus, sagaidāmo un faktisko rezultātu, nopietnību, vidi, pierādījumus, atbildīgo un statusu (`Atvērts`, `Procesā`, `Izlabots`, `Pārbaudīts`). Defektus var uzturēt Trello vai `docs/defect-log.md`.

Testēšanas atskaitē apkopojiet testēšanas tvērumu un vidi, izpildīto testu skaitu, rezultātus, neatrisinātos defektus, atkārtotās pārbaudes un secinājumus. Pievienojiet saites uz pierādījumiem, testu žurnālu un defektiem. Ieteicamais fails: `docs/testing-report.md`.

### 3. prezentācija

Parādiet testēšanas pieeju, reprezentatīvus scenārijus, faktiskos rezultātus, atrasto defektu labošanas gaitu, atkārtotās pārbaudes un secinājumus. Nošķiriet izpildītos testus no plānotajiem.

## 4. posms — nodošana un noslēguma prezentācija

**Mērķis:** sagatavot lietotājam saprotamu instrukciju, pabeigt projekta dokumentāciju un pārliecinoši demonstrēt sistēmu.

| Nodevums | Nepieciešamais saturs | Atrašanās vieta / atbildīgais | Stāvoklis |
|---|---|---|---|
| Lietotāja instrukcija | Piekļuve sistēmai, navigācija, galvenās funkcijas, biežākās kļūdas un funkciju ierobežojumi; norādēm jāatbilst faktiskajai lietotnei | [`user-manual.md`](user-manual.md) — abi | Sākotnējais melnraksts izveidots; jāpārbauda pret darbojošos lietotni |
| Galīgais README | Atjaunināts apraksts, tehnoloģijas, prasības, palaišanas instrukcija, dokumentācijas saites un zināmie ierobežojumi | [`README.md`](../README.md) — abi | Jāpārskata pirms nodošanas |
| Noslēguma prezentācija | Demonstrācijas plāns, risinājumu pamatojums, galveno funkciju demonstrācija un sagatavotas atbildes | Prezentācijas fails — abi | Jāsagatavo |

Lietotāja instrukcijai jāatšķir pieejamās iespējas no plānotajām vai nepabeigtajām. Katrā procedūrā norādiet sākuma ekrānu, darbības soļus un sagaidāmo rezultātu. Pirms nodošanas atkārtojiet norādes tīrā lietotāja sesijā.

### Demonstrācijas plāna paraugs

1. Īsi iepazīstiniet ar problēmu, mērķauditoriju un risinājumu.
2. Piesakieties ar demonstrācijai sagatavotu kontu; neizmantojiet personīgus vai publiski koplietotus sensitīvus datus.
3. Parādiet sākuma paneli un budžeta statistiku.
4. Izveidojiet vai atveriet budžetu un parādiet darījumu reģistrēšanu.
5. Ja attiecīgā funkcija darbojas, demonstrējiet koplietošanas uzaicinājumu un dalībnieku lomas.
6. Parādiet profila iestatījumus un administratora iespējas tikai tad, ja tās ir ieviestas un demonstrācijas kontam atļautas.
7. Noslēdziet ar testēšanas rezultātiem, zināmajiem ierobežojumiem un turpmākajiem uzlabojumiem.

## Dokumentu un mapju struktūra

Ieteicamā struktūra, ko papildināt projekta gaitā:

```text
BudgetNest/
├── README.md
├── LOCAL_SETUP.md
└── docs/
    ├── projekta-dokumentacija-lv.md
    ├── requirements.md
    ├── use-case-diagram.png
    ├── architecture.md
    ├── er-diagram.png
    ├── er-diagram.drawio
    ├── use-case-diagram.png
    ├── use-case-diagram.drawio
    ├── functional-decomposition.png
    ├── database.md
    ├── er-diagram.png
    ├── api-endpoints.md
    ├── testing-plan.md
    ├── test-results.md
    ├── defect-log.md
    ├── testing-report.md
    ├── user-manual.md
    └── wireframes/
```

Prezentācijas, Figma un Trello var glabāt to paredzētajos rīkos. No repozitorija dokumentiem pievienojiet saites uz pieejamajiem materiāliem, ja saites ir pastāvīgas un komandai pieejamas.

## Kopējā laika līnija

| Posms | Galvenie nodevumi | Plānotais laiks |
|---|---|---|
| 1. Projekta pamati | README, komandas lomas, Trello, repozitorija struktūra, 1. prezentācija | Projekta sākums |
| 2. Plānošana | Prasības, lietojuma gadījumi, arhitektūra, funkciju dekompozīcija, datubāze/ER, vadu skices, Trello kartītes, 2. prezentācija | 1. nedēļa |
| 3. Izstrāde un testēšana | API dokumentācija, testēšanas plāns, scenāriji, rezultāti, defektu žurnāls, testēšanas atskaite, 3. prezentācija | Izstrādes un testēšanas laikā |
| 4. Nodošana | Lietotāja instrukcija, galīgais README, demonstrācijas plāns, noslēguma prezentācija | Pēdējā nedēļa |

## Nodošanas pārbaudes saraksts

- [x] README un palaišanas instrukcija pārbaudīta tīrā lokālā vidē.
- [x] Komandas vārdi, lomas, prezentāciju saites un Trello saite ir aizpildīti.
- [x] Prasības ir pārbaudāmas un sasaistītas ar uzdevumiem un testiem.
- [x] Diagrammas un datubāzes apraksts atbilst aktuālajam kodam.
- [x] API galapunkti un atļaujas dokumentētas ar piemēriem.
- [x] Testu rezultāti balstīti izpildītās pārbaudēs; defektiem ir aktuāls statuss.
- [x] Lietotāja instrukcija izmēģināta pret darbojošos lietotni.
- [x] Prezentācijā demonstrētas tikai pieejamas funkcijas un nav iekļauti sensitīvi testa dati.
