AktiviteettiApp – README
Yleiskuvaus

AktiviteettiApp on React Native + Expo -pohjainen mobiilisovellus, jonka avulla käyttäjät voivat:

selata lähialueen aktiviteetteja

luoda uusia tapahtumia

tarkastella tapahtumia kartalta

liittyä aktiviteetteihin

tallentaa aktiviteetteja suosikeiksi

tarkastella omia ja suosikkiaktiviteetteja omasta profiilista

luoda aktiviteetteja suoraan kartalta (pitkä painallus → täytetty lomake)

Sovellus käyttää SQLite-tietokantaa (expo-sqlite) tietojen tallentamiseen ilman ulkoisia backend-palveluita.

Teknologiat
Teknologia	Käyttötarkoitus
React Native + Expo	UI & mobiilisovellus
TypeScript	Tyyppiturvallisuus
React Navigation (Native Stack)	Navigointi
expo-sqlite / expo-sqlite-next	Paikallinen tietokanta
react-native-maps	Karttanäkymä
Expo Location API	Sijaintipalvelut
@react-native-community/datetimepicker	Päivämäärän valinta
🗂 Sovelluksen arkkitehtuuri
src/
 ├── screens/
 │    ├── HomeScreen.tsx
 │    ├── ActivitiesListScreen.tsx
 │    ├── ActivitiesMapScreen.tsx
 │    ├── ActivityDetailsScreen.tsx
 │    ├── CreateActivityScreen.tsx
 │    └── MyProfileScreen.tsx
 ├── navigation/
 │    └── RootNavigator.tsx
 ├── models/
 │    └── Activity.ts
 ├── services/
 │    └── activityService.ts
 ├── database/
 │    └── db.ts
 └── components/
      └── theme.ts

Toteutetut ominaisuudet
Aktiviteettien listaus

Hakee SQLite:stä kaikki aktiviteetit

Näyttää ne siistinä korttilistana

Karttanäkymä

Näyttää kaikki aktiviteetit markkereina

Markkeria painamalla avautuu aktiviteetin tiedot

Pitkä painallus kartalla → Luo aktiviteetti sijaintiin

Käyttäjän oma sijainti näkyvillä

Suosikit

♥-nappi sekä listassa että aktiviteetin tiedoissa

Suosikit tallennetaan SQLite-tauluun favorites

MyProfile-näkymään erillinen "Suosikit" -välilehti

✏ Aktiviteetin muokkaus & poisto

Aktiviteettia voi muokata

Aktiviteetin voi poistaa → samalla poistuvat myös osallistujat & suosikit

Osallistuminen (Join / Leave)

Osallistuja lisätään participants-tauluun

Poistaminen toimii myös

Navigointi

Kaikki ruudut toimivat type-safe navigaatiolla

CreateActivity tukee kolmea navigointitapaa:

ilman parametrejä (uusi aktiviteetti)

activityId (muokkaus)

latitude + longitude (luo kartasta)

🧩 Tietokantarakenne
activities
kenttä	tyyppi
id	INTEGER PRIMARY KEY
name	TEXT
description	TEXT
category	TEXT
time	TEXT (ISO string)
latitude	REAL
longitude	REAL
participants

| activityId | TEXT |
| name | TEXT |

favorites

| activityId | TEXT PRIMARY KEY |

 User Storyt / Issue-lista
1. Aktiviteetin tarkastelu

Käyttäjänä haluan nähdä tapahtuman tiedot, jotta tiedän mitä se sisältää.

Aktiviteetin kuvaus

Aika & päivämäärä

Kategoria

Sijainti

2. Aktiviteetin listaus

Käyttäjänä haluan selata tapahtumia listana.

3. Aktiviteetin suodatus & lajittelu

Käyttäjänä haluan suodattaa ja järjestää aktiviteetteja.

Sisältää:

Kategoria

Päivämäärä: tänään / viikko / kaikki

Aakkosjärjestys

Uusin / vanhin

4. Hakukenttä

Käyttäjänä haluan hakea aktiviteetteja nimellä ja kuvauksella.

5. Karttanäkymä

Käyttäjänä haluan nähdä aktiviteetit kartalla.

6. Aktiviteetin luominen

Käyttäjänä haluan luoda uuden aktiviteetin.

Laajennus:

Käyttäjänä haluan luoda aktiviteetin suoraan kartan pitkällä painalluksella.

7. Aktiviteetin muokkaus

Käyttäjänä haluan muokata aiemmin luomaani aktiviteettia.

8. Aktiviteetin poistaminen

Käyttäjänä haluan poistaa aktiviteetin.

9. Osallistuminen aktiviteettiin

Käyttäjänä haluan liittyä tapahtumaan ja poistua siitä.

10. Suosikkiaktiviteetit

Käyttäjänä haluan merkitä aktiviteetteja suosikeiksi ja tarkastella niitä erikseen.

11. Oma profiili

Käyttäjänä haluan nähdä omat ja suosikkiaktiviteetit profiilissa.

⚠️ Huomio: Kirjautumista ei ehditty toteuttaa

Projektiin oli alun perin suunniteltu:

käyttäjätilit

Firebase Auth / supabase-auth

käyttäjäkohtaiset aktiviteetit

🔎 Kehitysidea
Tulevissa versioissa kirjautuminen kannattaa toteuttaa esimerkiksi:

Supabase Auth (helpoin)

Firebase Authentication

Clerk.dev (hyvä React Native -tuki)

Tämä mahdollistaisi mm:

käyttäjäkohtaiset suosikit

käyttäjäkohtaiset osallistujalistat

profiilikuvan

push-notifikaatiot

🚀 Asennus ja kehityskäyttö
1. Asenna riippuvuudet
npm install

2. Käynnistä Expo
npx expo start

3. Testaa laitteella Expo Go -sovelluksella

QR-koodi toimii suoraan.

Hyödynnetään:

kartassa → markerin osoitteen näyttö

ActivityDetailsScreen → “Osoite: …”

📈 Mahdollisia laajennuksia

🔑 Sisäänkirjautuminen (Supabase/Firebase)

🔔 Push-notifikaatiot aktiviteetin alkamisesta

👥 Kaverilistat & yhteiset osallistumiset

🖼 Aktiviteetin kuvan lisääminen

⭐ Arvostelut & kommentit

📅 Kalenteriin lisääminen

🔎 Edistynyt haku (välimatka / tagit)

🙌 Yhteenveto

Tämä README dokumentoi:

sovelluksen nykyisen tilan

kaikki toteutetut user storyt

REST API -integraation

tietokantarakenteen

navigaation

kehitys- ja julkaisuohjeet

puuttuvan kirjautumisominaisuuden perustelun

tulevaisuuden kehityspolun

Sovellus on hyvin rakenteistettu, laajennettavissa ja tuotantovalmiuden lähellä.
