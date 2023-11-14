# Potato Empire

### Információk
- **Név:** Joshua Hegedus (joshika39)
- **Neptun kód:** YQMHWO
- **Repo:** https://github.com/joshika39/potato-empire

### Használati útmutató

A játék élő verzióját a [`https://potato-empire.bitof.faith/`](https://potato-empire.bitof.faith/) 
címen érhetjük el.

#### Irányítás

A játékot egérrel tudjuk irányítani. Illetve vannak billnetyűkre gyorsbillentyűk is:
- `R` - forgatás
- `T` - tükrözés
- `Shift + R` - Újrakezdés

Van még egy `Üres mezők kikapcsolása` gomb amellyel le tudjuk vágni a felesleges üres mezőket. Így teljes írányítást
kaphatunk a lerakható elemeknél.

#### Reszponzivitás

A játék **teljesen** reszponzív. A játékot bármilyen méretű kijelzőn lehet játszani. 

> **Megjegyzés:** A játékot mobil illetve tablet eszközökön is lehet játszani, de itt a második kattintásra fogja lerakni
> a játékos a kiválasztott elemet. Ez a játékmenetet nem befolyásolja, csak a kényelmetlenséget növeli.

#### Extra funkciók

- Ha a rejtett küldetésekre húzza az egerét, akkor megjelennek a teljesíthető rejtett küldetések.
  - Van egy ajándék rejtetett küldetés: **`The Eastern Gate`**
- A játék folyamatosan menti az állapotát a localStorage-ba. Így ha a játékot bezárjuk, akkor a következő
  oldal betöltéskor folytathatjuk a játékot.

### Megvalósítás részletei

- Minden reprezentáció dinamikusan történik, ha hozzáadunk egy új küldetést akkor az az új betöltéskor automatikusan
  megjelenik.
- OOP megvalósítás
  - A térképek egy `Map` absztrakt osztályból származnak le.    
    - `InteractiveMap`
    - `PreviewMap`
  - A küldetések egy `QuestBase` absztrakt osztályból származnak le.
    - `Quest`
    - `HiddenQuest`
  - Létezik még a `Tile` és `Position` osztály is, amelyek a mezők és pozíciók reprezentálására szolgálnak.

### Teljesített követelmények

Webprogramozás - számonkérés
Ezt a megoldást a fent írt hallgató küldte be és készítette a Webprogramozás kurzus számonkéréséhez.
Kijelentem, hogy ez a megoldás a saját munkám. Nem másoltam vagy használtam harmadik féltől
származó megoldásokat. Nem továbbítottam megoldást hallgatótársaimnak, és nem is tettem közzé.
Az Eötvös Loránd Tudományegyetem Hallgatói Követelményrendszere
(ELTE szervezeti és működési szabályzata, II. Kötet, 74/C. §) kimondja, hogy mindaddig,
amíg egy hallgató egy másik hallgató munkáját - vagy legalábbis annak jelentős részét -
saját munkájaként mutatja be, az fegyelmi vétségnek számít.
A fegyelmi vétség legsúlyosabb következménye a hallgató elbocsátása az egyetemről.

### Minimálisan teljesítendő (enélkül nem fogadjuk el, 8 pont)
- [x] Négyzetrács: A játék elindítása után kirajzolódik a 11x11 térkép kirajzolása a hegyekkel a megfelelő helyen. (1 pont)
- [x] Lehelyezés: A térképelemek közül egy véletlenszerűen megjelenik a hozzájuk tartozó időegységekkel. (1 pont)
- [x] Lehelyezés: A térképelemet le tudjuk helyezni a négyzetrácsra (bárhova). (2 pont)
- [x] Idő: A játék 28 időegységig tart, és a térképelemek lehelyezésével kivonja a térképelemhez tartozó időegységet belőle. (1 pont)
- [x] Küldetés: a "Határvidék" küldetés pontszámát ki tudja számolni. (1 pont)
- [x] Vége: Minden küldetésnél kiírja, hogy melyik küldetésre hány pontot kaptunk. (1 pont)
- [x] Vége: A játék végén, a 28 időegység eltelte után a Határvidék alapküldetéshez tartozó pontszámot kiszámolja, és kiírja hány pontot értünk el. (1 pont)

### Az alap feladatok (12 pont)
- [x] Lehelyezés: A térképelemet szabályosan tudja lehelyezni. (2 pont)
- [x] Lehelyezés: A megjelenített térképelem forgatható, és azt így tudjuk lehelyezni. (1 pont)
- [x] Lehelyezés: A megjelenített térképelem tükrözhető, és azt így tudjuk lehelyezni. (1 pont)
- [x] Küldetés: a "Az erdő széle" küldetés megjelenik és pontszámát ki tudja számolni. (1 pont)
- [x] Küldetés: a "Álmos völgy" küldetés megjelenik és pontszámát ki tudja számolni. (1 pont)
- [x] Küldetés: a "Krumpliöntözés" küldetés megjelenik és pontszámát ki tudja számolni. (1 pont)
- [x] Évszak: A játék 4 évszakon keresztül tart, minden évszak 7 időegységig tart, az évszakokhoz tartozó küldetéskártyák kiemelődnek. (1 pont)
- [x] Évszak: Minden évszak végén kiszámolódik a hozzájuk tartozó küldetésekből az évszak végi pontszám, és a játék folytatódik a következő évszakra. (1 pont)
- [x] Küldetés: A hegyek teljes bekerítésével 1 plusz pont szerezhető, amelyek minden évszak (vagy a játék) végén hozzáadódnak a pontszámunkhoz (1 pont)
- [x] Játék vége: A játék végén megjelenik a négy évszak alatt szerzett összpontszám (1 pont)
- [x] Igényes megjelenés (1 pont)

### Extrák (10 pont)
- [x] Küldetés: Fasor (1 pont)
- [x] Küldetés: Öntözőcsatorna (1 pont)
- [x] Küldetés: Gazdag város (1 pont)
- [x] Küldetés: Mágusokvölgye (1 pont)
- [x] Küldetés: Üres telek (1 pont)
- [x] Küldetés: Sorház (1 pont)
- [x] Küldetés: Páratlan silók (1 pont)
- [x] Küldetés: Gazdag vidék (1 pont)
- [x] Mentés: A játék folyamatosan menti állapotát a localStorage-ba. Oldal betöltésekor, ha van itt ilyen mentett állapot, akkor onnan tölti be, egyébként új játék indul. Játék végén törlődik a mentett állapot. (2 pont)