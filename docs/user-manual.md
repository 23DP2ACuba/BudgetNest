# BudgetNest lietotāja instrukcija

## 1. Par lietotni

BudgetNest paredzēts budžetu, ienākumu un izdevumu uzskaitei, kā arī budžetu koplietošanai ar citiem lietotājiem. Šī instrukcija apraksta repozitorijā redzamās funkcijas. Daļa React ekrānu var būt nepabeigta; šādos gadījumos zemāk tas ir īpaši norādīts.

## 2. Lietotnes atvēršana

Lai palaistu lietotni lokāli, izpildiet projekta [`LOCAL_SETUP.md`](../LOCAL_SETUP.md) instrukciju. Tā apraksta priekšnosacījumus un backend/frontend palaišanu atsevišķos termināļos.

- Frontend lokāli parasti atverams: `http://localhost:5173`
- Backend API lokāli parasti pieejams: `http://localhost:8000/api`

Lietotnei nepieciešama darbojoša API un datubāze. Ja skats nevar ielādēt datus, pārliecinieties, ka darbojas abi servisi un pārlūkā ir pareizā API konfigurācija.

### Pieteikšanās pieejamība

API nodrošina reģistrācijas un pieteikšanās galapunktus. Tomēr React maršrutos `/login` un `/register` pašlaik ir sagataves, nevis pilnas formas. Backend projektā ir arī atsevišķi Laravel/Inertia pieteikšanās un reģistrācijas skati; tie ir cita saskarne. Ja React vidē nevarat pieteikties, sazinieties ar projekta administratoru par pašlaik izmantoto piekļuves veidu.

## 3. Sākuma panelis

Ja jums ir piekļuve funkcionējošam panelim, tas paredzēts finanšu kopsavilkumam:

- budžetu, ienākumu un izdevumu kopsummas;
- statistikas atlase pēc konkrēta budžeta vai visiem budžetiem;
- ienākumu/izdevumu tendences un izdevumu sadalījums pa kategorijām;
- jaunākie darījumi un saites uz budžetiem/darījumu sarakstu;
- gaidošo uzaicinājumu darbības, ja tādi ir.

Skaitļi ir atkarīgi no pieejamajiem darījumiem. Pirms finanšu lēmumu pieņemšanas pārbaudiet, vai visi attiecīgā perioda ieraksti ir ievadīti.

## 4. Darījumi

Darījums ir ienākums vai izdevums, kas piesaistīts budžetam un kategorijai.

### Darījuma izveide

Ja darījumu skats ir pieejams:

1. Atveriet **Transactions**.
2. Izvēlieties **Add Transaction**.
3. Norādiet budžetu un kategoriju.
4. Izvēlieties **Income** vai **Expense**.
5. Ievadiet summu (vismaz `0,01`), datumu un, ja vajadzīgs, aprakstu.
6. Saglabājiet ar **Create**.

### Darījumu filtrēšana

Darījumu sarakstu var filtrēt pēc veida, kategorijas un datumu intervāla. **Reset** notīra filtrus. API darījumu saraksts tiek lapots, tāpēc var būt vairākas rezultātu lapas.

### Labošana un dzēšana

Izvēlieties **Edit**, lai mainītu atļautos laukus, un saglabājiet ar **Update**. **Delete** dzēš izvēlēto darījumu pēc apstiprinājuma. Dzēšanu nevar atsaukt. Ja darbība tiek atteikta, iespējams, jūsu kontam nav nepieciešamo tiesību.

## 5. Budžeti un koplietošana

Budžeta detaļās paredzēts apskatīt budžeta summu, ienākumus, izdevumus, bilanci, darījumus un dalībniekus.

### Budžeta izveide un pārvaldība

Backend API atbalsta budžeta izveidi, labošanu un dzēšanu. Taču React maršrutā `/budgets` pašlaik ir sagatave, tāpēc šīs darbības var nebūt pieejamas no lietotāja saskarnes.

### Uzaicinājumi

Budžeta detaļu skatā, ja tas ir pieejams, īpašnieks var uzaicināt reģistrētu lietotāju pēc e-pasta un piešķirt lomu:

- **Viewer** — tikai skatīšanai paredzētā loma;
- **Editor** — darījumu rediģēšanai paredzētā loma;
- **Owner** — plašākām budžeta pārvaldības tiesībām paredzētā loma.

Uzaicinātais lietotājs panelī var izvēlēties **Accept** vai **Decline**. Pēc pieņemšanas budžets kļūst pieejams lietotājam atbilstoši piešķirtajai lomai.

Dalībnieka **Remove** darbība noņem viņu no budžeta. **Leave Budget** ļauj dalībniekam aiziet; budžeta izveidotājs nevar to izdarīt ar šo darbību. Pirms noņemšanas vai aiziešanas rūpīgi pārbaudiet budžeta identitāti.

> Lomu atļauju faktiskā piemērošana jāapstiprina ar projekta testiem; lomas nosaukums vien negarantē, ka katra API darbība ir ierobežota tieši tā, kā paredzēts.

## 6. Profils un konts

Ja profila skats ir pieejams:

- **Edit** ļauj mainīt vārdu un e-pastu; **Save Changes** saglabā, bet **Cancel** atceļ nesaglabātās izmaiņas.
- Paroles maiņai ievadiet pašreizējo paroli, jauno paroli un tās apstiprinājumu; jaunajai parolei jābūt vismaz 8 rakstzīmes garai.
- Konta dzēšanai, ja šāda darbība tiek piedāvāta, vajadzīga paroles apstiprināšana. Dzēšana var būt neatgriezeniska.

Ja e-pasta adrese jau ir izmantota vai parole nav derīga, sistēma parāda kļūdu un izmaiņas netiek pieņemtas.

## 7. Kategorijas un administrēšana

Backend API nodrošina kategoriju pārvaldības maršrutus un administratora maršrutus. Pašreizējā React lietotnē kategoriju un administratora skati var nebūt pilnībā ieviesti; administratora maršrutam `/admin` pārbaudiet aktuālo versiju.

Administratora API paredzēts administratora kontam, un tā piekļuvei vajadzīga `admin` loma. Neizpaudiet administratora konta datus un neizmantojiet izstrādes noklusējuma akreditācijas datus koplietotā vai produkcijas vidē.

## 8. Kļūdu novēršana

| Problēma | Ko darīt |
|---|---|
| Lapa neielādējas | Pārbaudiet, vai frontend un backend ir palaisti; pārlādējiet lapu. |
| Pieteikšanās vai darbība atgriež kļūdu | Pārbaudiet ievadītos datus; pārliecinieties, ka sesija/token nav beidzies. |
| Budžets vai darījumi nav redzami | Pārbaudiet, vai izvēlēts pareizais budžets un vai kontam ir piekļuve. |
| Saglabāšana tiek atteikta | Pārbaudiet obligātos laukus, datumu secību, summu un dalībnieka lomu. |
| Uzaicinājumu nevar nosūtīt | Saņēmēja e-pastam jābūt reģistrētam; pārbaudiet, vai uzaicinājums jau nav gaidošs vai pieņemts. |
| Nepieejama funkcija | Iespējams, attiecīgais React skats vēl nav ieviests; sazinieties ar projekta komandu. |

Atkārtotas problēmas gadījumā pierakstiet kļūdas ziņojumu, lapu, darbību un laiku, bet nesūtiet paroles vai autentifikācijas tokenus.

## 9. Droša lietošana

- Neizpaudiet paroli vai API tokenu citām personām.
- Izmantojiet tikai budžetus, kuriem jums ir piešķirta piekļuve.
- Pirms dzēšanas vai dalībnieka noņemšanas pārbaudiet izvēlēto ierakstu.
- Ievadiet finanšu ierakstus precīzi un periodiski pārskatiet tos.
- Lokālie demo konti ir paredzēti tikai izstrādei; nomainiet noklusējuma paroles pirms koplietošanas.

## 10. Dokumentācijas statuss

Šī instrukcija jāpārbauda pret katru izlaisto lietotnes versiju. Ja saskarne mainās, atjauniniet soļus un atzīmējiet funkcijas, kas vēl nav pieejamas. Lokālās uzstādīšanas soļi atrodami [`LOCAL_SETUP.md`](../LOCAL_SETUP.md), bet projekta prasības un sistēmas uzbūve — [`requirements.md`](requirements.md) un [`architecture.md`](architecture.md).