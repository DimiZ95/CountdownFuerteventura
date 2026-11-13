// ============================================================================
//  ALLE INHALTE AN EINER STELLE
//  Texte, Fragen, Punkte, Preise, Codes, Verstecke und Daten stehen hier.
//  Türchen, die Milena schon gespielt hat, und eingelöste Codes nicht mehr ändern.
// ============================================================================

export type Step =
  | { type: 'audio'; title: string; text: string; src?: string }
  | { type: 'quiz'; q: string; options: string[]; answer: number; points: number; fact?: string }
  | { type: 'estimate'; q: string; answer: number; tolerance: number; unit: string; points: number; fact?: string }
  | { type: 'choice'; q: string; a: string; b: string; points: number; note?: string }
  | { type: 'open'; q: string; points: number; placeholder?: string }
  | { type: 'memory'; title: string; cards: string[]; points: number }
  | { type: 'hint'; title: string; text: string }
  // Junior-Runde (Leano & Marlo): keine falschen Antworten, nur Muscheln
  | { type: 'tap'; q: string; options: { emoji: string; label: string; ok?: boolean }[]; shells: number; src?: string }
  | { type: 'mission'; text: string; shells: number; src?: string }

export type Door = {
  id: number
  date: string // JJJJ-MM-TT, öffnet um config.unlockHour
  title: string
  emoji: string
  phase: 'mailand' | 'inselpost' | 'endspurt'
  steps: Step[]
  junior?: Step[]
  collectible?: string // gibt es, wenn Mamas Runde fertig ist
}

export type Code = {
  code: string // Text-Code (Großbuchstaben) oder Bildcode (Emojis ohne Leerzeichen)
  kind: 'text' | 'pic'
  label: string // nur für den Druckbogen: wo liegt das Kärtchen?
  message: string
  points?: number
  shells?: number
  collectible?: string
  stage?: 1 | 2 // schaltet eine Finale-Etappe frei
}

export type Reward = {
  id: string
  emoji: string
  title: string
  price: number
  where: 'zuhause' | 'urlaub'
  multi?: boolean // mehrfach kaufbar
  hiddenUntil?: string // Sammelobjekt, das die Belohnung sichtbar macht
}

export const config = {
  family: { mama: 'Milena', papa: 'Papa', kids: 'Leano & Marlo', big: 'Leano', small: 'Marlo' },
  departure: '2026-12-09T06:00:00',
  unlockHour: 6,
  mascot: { name: 'Majo', emoji: '🐐' },
  // Wohnort für den Wettervergleich
  home: { name: 'Ober-Ramstadt', lat: 49.83, lon: 8.75 },
  island: { name: 'Corralejo', lat: 28.73, lon: -13.87 },
  // Papas Nummer im Format 49171… (ohne +), dann geht "An Papa senden" direkt an dich
  papaWhatsApp: '',
  consolationPoints: 2,
  finaleFrom: '2026-12-08',
}

// ---------------------------------------------------------------------------
//  TÜRCHEN
//  Phase 1: Papa in Mailand (täglich) · Phase 2: Inselpost (Mi/Fr/So)
//  Phase 3: Endspurt ab 1.12. (täglich, kurz – der Adventskalender läuft parallel)
// ---------------------------------------------------------------------------
export const doors: Door[] = [
  {
    id: 1, date: '2026-11-14', title: 'Leinen los!', emoji: '⛵', phase: 'mailand',
    steps: [
      { type: 'audio', title: 'Nachricht von Papa',
        text: 'Guten Morgen, ihr drei! Ich bin auf dem Weg nach Mailand – aber ab heute zählen wir zusammen runter. In 25 Tagen sitzen wir im Flieger nach Fuerteventura. Jeden Tag wartet hier ein Türchen auf dich, und in der Wohnung ist auch etwas versteckt. Viel Spaß – ich denk an euch!' },
      { type: 'quiz', q: 'Wie heißt die Hauptstadt von Fuerteventura?', options: ['Corralejo', 'Puerto del Rosario', 'Betancuria', 'Morro Jable'], answer: 1, points: 10,
        fact: 'Puerto del Rosario hieß früher „Puerto de Cabras“ – Ziegenhafen. Majo findet das angemessen.' },
      { type: 'choice', q: 'Erster Urlaubstag: Was machen wir zuerst?', a: '🏖️ Sofort an den Strand', b: '🍹 Erst mal ein Drink am Pool', points: 5, note: 'Notiert. So machen wir das.' },
      { type: 'hint', title: 'Etwas zum Knuspern für heute Abend', text: 'Schau in deinen Kleiderschrank, hinter deine Pullover. Auf dem Zettel steht ein Codewort – das gibst du auf der Startseite unter „Code einlösen“ ein.' },
    ],
    junior: [
      { type: 'mission', text: 'Papa sagt: „Leano, schau mal in deine Gummistiefel! Da steckt was für dich. Zeig es auch Marlo!“', shells: 1 },
      { type: 'tap', q: 'Was kommt mit in den Urlaubskoffer?', shells: 1,
        options: [{ emoji: '🩳', label: 'Badehose', ok: true }, { emoji: '⛄', label: 'Schneemann' }, { emoji: '🧤', label: 'Handschuhe' }] },
    ],
  },
  {
    id: 2, date: '2026-11-15', title: 'Pudding-Sonntag', emoji: '🌞', phase: 'mailand', collectible: 'karte1',
    steps: [
      { type: 'audio', title: 'Nachricht von Papa',
        text: 'Sonntag ohne mich – dafür mit Pudding für euch drei. Macht es euch gemütlich. Bis Dienstagabend ist es nicht mehr lang.' },
      { type: 'estimate', q: 'Wie lang ist Fuerteventura von Nord nach Süd?', answer: 100, tolerance: 15, unit: 'km', points: 10,
        fact: 'Rund 100 km – die längste der Kanareninseln.' },
      { type: 'memory', title: 'Insel-Memory', cards: ['🐐', '🌵', '🏄', '🐚', '🦎', '🌋'], points: 10 },
      { type: 'hint', title: 'Drei Tassen für drei Leute', text: 'Schau in den Küchenschrank, ganz hinten bei den Tassen. Eine für dich, eine für Leano, eine für Marlo. Das Codewort liegt dabei.' },
    ],
    junior: [
      { type: 'tap', q: 'Welches Tier wohnt auf Fuerteventura?', shells: 1,
        options: [{ emoji: '🐧', label: 'Pinguin' }, { emoji: '🐐', label: 'Ziege', ok: true }, { emoji: '🐻‍❄️', label: 'Eisbär' }] },
      { type: 'mission', text: 'Mach Marlo vor, wie eine Ziege macht. Määäh!', shells: 1 },
    ],
  },
  {
    id: 3, date: '2026-11-16', title: 'Halbzeit ohne Papa', emoji: '🛋️', phase: 'mailand',
    steps: [
      { type: 'quiz', q: 'Welcher Kontinent liegt Fuerteventura am nächsten?', options: ['Europa', 'Südamerika', 'Afrika', 'Asien'], answer: 2, points: 10,
        fact: 'Bis zur marokkanischen Küste sind es nur etwa 100 km.' },
      { type: 'open', q: 'Wer von uns verliert im Urlaub zuerst die Sonnenbrille – und warum?', points: 5, placeholder: 'Deine Prognose …' },
      { type: 'hint', title: 'Halbzeit geschafft', text: 'Heute ist das Versteck für die Jungs – schau in ihre Runde. Und heute Abend rufe ich an!' },
    ],
    junior: [
      { type: 'mission', text: 'Papa sagt: „Schaut mal in meinen Turnschuh im Flur! Da steckt eine Gute-Nacht-Geschichte. Mama liest sie euch heute Abend vor.“', shells: 1 },
      { type: 'tap', q: 'Welche Farbe hat das Meer?', shells: 1,
        options: [{ emoji: '🟦', label: 'Blau', ok: true }, { emoji: '🟪', label: 'Lila' }, { emoji: '🟫', label: 'Braun' }] },
    ],
  },
  {
    id: 4, date: '2026-11-17', title: 'Papa landet', emoji: '🛬', phase: 'mailand',
    steps: [
      { type: 'audio', title: 'Nachricht von Papa',
        text: 'Heute Abend gegen halb neun bin ich wieder da. Die Jungs schlafen dann wahrscheinlich schon – du hoffentlich noch nicht.' },
      { type: 'quiz', q: 'Wie lange fliegen wir ungefähr nach Fuerteventura?', options: ['2 Stunden', '4,5 Stunden', '7 Stunden', '10 Stunden'], answer: 1, points: 10,
        fact: 'Etwa 4,5 Stunden. Genug Zeit für eine Überraschung über den Wolken …' },
      { type: 'choice', q: 'Heute Abend, wenn ich da bin:', a: '🍷 Ein Glas und erzählen', b: '🎬 Sofa und Film', points: 5, note: 'Abgemacht.' },
      { type: 'hint', title: 'Nachtisch für alle', text: 'Schau in den Vorratsschrank, hinter die Nudeln. Reicht für euch drei. Das Codewort liegt dabei.' },
    ],
    junior: [
      { type: 'mission', text: 'Papa sagt: „Wenn du morgen aufwachst, bin ich wieder da!“ Mal ein Willkommensbild und leg es vor die Tür.', shells: 2 },
    ],
  },
  {
    id: 5, date: '2026-11-18', title: 'Wieder komplett', emoji: '👨‍👩‍👦‍👦', phase: 'inselpost', collectible: 'karte2',
    steps: [
      { type: 'hint', title: 'Post aus Mailand', text: 'Am Frühstückstisch liegt etwas aus Mailand. Das Codewort steht dabei.' },
      { type: 'quiz', q: 'Fuerteventura ist die … Insel der Kanaren.', options: ['größte', 'zweitgrößte', 'kleinste', 'jüngste'], answer: 1, points: 10,
        fact: 'Zweitgrößte nach Teneriffa – und die älteste: rund 20 Millionen Jahre.' },
    ],
    junior: [
      { type: 'mission', text: 'Zeig Papa dein Willkommensbild und erzähl ihm, was du mit Mama gemacht hast.', shells: 1 },
    ],
  },
  {
    id: 6, date: '2026-11-20', title: 'Dünen & Wind', emoji: '🏜️', phase: 'inselpost',
    steps: [
      { type: 'quiz', q: 'Wofür ist Corralejo besonders bekannt?', options: ['Einen Vulkansee', 'Riesige Wanderdünen', 'Einen Regenwald', 'Eine Burg'], answer: 1, points: 10,
        fact: 'Der Naturpark der Dünen von Corralejo zieht sich kilometerlang am Meer entlang.' },
      { type: 'choice', q: 'Ausflug Nummer eins:', a: '🏜️ Dünen von Corralejo', b: '🌊 Wilder Strand von Cofete', points: 5, note: 'Steht auf dem Plan.' },
    ],
    junior: [
      { type: 'tap', q: 'Womit baut man eine Sandburg?', shells: 1,
        options: [{ emoji: '🪣', label: 'Eimer', ok: true }, { emoji: '🎸', label: 'Gitarre' }, { emoji: '📺', label: 'Fernseher' }] },
    ],
  },
  {
    id: 7, date: '2026-11-22', title: 'Familiensonntag', emoji: '🧩', phase: 'inselpost', collectible: 'karte3',
    steps: [
      { type: 'memory', title: 'Strand-Memory', cards: ['🍦', '🩴', '⛱️', '🐠', '🦀', '🕶️'], points: 10 },
      { type: 'open', q: 'Welcher gemeinsame Urlaubsmoment fällt dir als Erstes ein?', points: 5, placeholder: 'Unser Moment …' },
    ],
    junior: [
      { type: 'mission', text: 'Alle zusammen: Baut eine Höhle aus Decken – das ist heute euer Strandzelt.', shells: 2 },
    ],
  },
  {
    id: 8, date: '2026-11-25', title: 'Geheime Mission', emoji: '🕵️‍♀️', phase: 'inselpost', collectible: 'muschel',
    steps: [
      { type: 'quiz', q: 'Was ist „Majorero“?', options: ['Ein Tanz', 'Ein Ziegenkäse', 'Ein Wind', 'Ein Vulkan'], answer: 1, points: 10,
        fact: 'Der Ziegenkäse der Insel – und so nennen sich auch die Einwohner. Majo ist stolz.' },
      { type: 'open', q: 'Geheime Mission: Schick Papa ein Foto von dem Teil, das als Erstes in deinen Koffer kommt. Was ist es?', points: 15, placeholder: 'Es ist …' },
    ],
    junior: [
      { type: 'tap', q: 'Was isst man am Strand am liebsten?', shells: 1,
        options: [{ emoji: '🍦', label: 'Eis', ok: true }, { emoji: '🥶', label: 'Schnee' }, { emoji: '🧦', label: 'Socken' }] },
    ],
  },
  {
    id: 9, date: '2026-11-27', title: 'Kanarische Küche', emoji: '🥔', phase: 'inselpost', collectible: 'karte4',
    steps: [
      { type: 'quiz', q: 'Was sind „Papas arrugadas“?', options: ['Runzelkartoffeln mit Salzkruste', 'Frittierte Fischbällchen', 'Süßes Gebäck', 'Eine Suppe'], answer: 0, points: 10,
        fact: 'Dazu gibt es Mojo – rot oder grün. Wir testen beide.' },
      { type: 'choice', q: 'Mojo?', a: '🌶️ Rojo (rot, pikant)', b: '🌿 Verde (grün, Koriander)', points: 5 },
    ],
    junior: [
      { type: 'mission', text: 'Hilf heute beim Kochen: Du darfst umrühren!', shells: 1 },
    ],
  },
  {
    id: 10, date: '2026-11-29', title: 'Erster Advent', emoji: '🕯️', phase: 'inselpost',
    steps: [
      { type: 'estimate', q: 'Wie warm ist es im Dezember tagsüber auf Fuerteventura?', answer: 21, tolerance: 2, unit: '°C', points: 10,
        fact: 'Etwa 21 °C. Schau mal auf den Wettervergleich auf der Startseite.' },
      { type: 'open', q: 'Was wünschst du dir für diesen Urlaub am meisten?', points: 5, placeholder: 'Ich wünsche mir …' },
    ],
    junior: [
      { type: 'tap', q: 'Womit fliegen wir in den Urlaub?', shells: 1,
        options: [{ emoji: '🚜', label: 'Traktor' }, { emoji: '✈️', label: 'Flugzeug', ok: true }, { emoji: '🛴', label: 'Roller' }] },
    ],
  },
  {
    id: 11, date: '2026-12-01', title: 'Endspurt!', emoji: '🏁', phase: 'endspurt', collectible: 'karte5',
    steps: [
      { type: 'quiz', q: 'Welche kleine Insel liegt direkt vor Corralejo?', options: ['La Graciosa', 'Isla de Lobos', 'El Hierro', 'La Gomera'], answer: 1, points: 10,
        fact: 'Die Isla de Lobos – benannt nach den Mönchsrobben, die dort früher lebten.' },
    ],
    junior: [
      { type: 'tap', q: 'Was schwimmt im Meer?', shells: 1,
        options: [{ emoji: '🐟', label: 'Fisch', ok: true }, { emoji: '🐄', label: 'Kuh' }, { emoji: '🚗', label: 'Auto' }] },
    ],
  },
  {
    id: 12, date: '2026-12-02', title: 'Alte Hauptstadt', emoji: '⛪', phase: 'endspurt',
    steps: [
      { type: 'quiz', q: 'Welcher Ort war die erste Hauptstadt der Insel?', options: ['Betancuria', 'La Oliva', 'Pájara', 'Antigua'], answer: 0, points: 10,
        fact: 'Betancuria, gegründet 1404 – versteckt in den Bergen, zum Schutz vor Piraten.' },
    ],
    junior: [{ type: 'mission', text: 'Such dein liebstes Kuscheltier aus, das mit in den Urlaub darf.', shells: 1 }],
  },
  {
    id: 13, date: '2026-12-03', title: 'Ganz oben', emoji: '⛰️', phase: 'endspurt', collectible: 'karte6',
    steps: [
      { type: 'estimate', q: 'Wie hoch ist der höchste Berg der Insel, der Pico de la Zarza?', answer: 807, tolerance: 100, unit: 'm', points: 10,
        fact: '807 Meter – mit Blick auf den Strand von Cofete.' },
    ],
    junior: [
      { type: 'tap', q: 'Was setzt du in der Sonne auf?', shells: 1,
        options: [{ emoji: '🧢', label: 'Kappe', ok: true }, { emoji: '🥾', label: 'Stiefel' }, { emoji: '🧣', label: 'Schal' }] },
    ],
  },
  {
    id: 14, date: '2026-12-04', title: 'Uhren umstellen', emoji: '🕰️', phase: 'endspurt',
    steps: [
      { type: 'quiz', q: 'Wie spät ist es auf Fuerteventura, wenn es bei uns 12 Uhr ist?', options: ['10 Uhr', '11 Uhr', '12 Uhr', '13 Uhr'], answer: 1, points: 10,
        fact: 'Eine Stunde früher. Eine Stunde mehr Urlaub am ersten Tag.' },
      { type: 'choice', q: 'Im Urlaub bist du eher:', a: '🌅 Frühaufsteherin am Strand', b: '😴 Ausschlafen ohne Wecker', points: 5 },
    ],
    junior: [{ type: 'mission', text: 'Probier deine Schwimmflügel oder Taucherbrille an!', shells: 1 }],
  },
  {
    id: 15, date: '2026-12-05', title: 'Koffer-Challenge', emoji: '🧳', phase: 'endspurt', collectible: 'karte7',
    steps: [
      { type: 'memory', title: 'Koffer-Memory', cards: ['🩱', '🧴', '👒', '📖', '🩴', '📷'], points: 10 },
      { type: 'hint', title: 'Die Schatzkarte ist komplett', text: 'Alle sieben Teile sind da. Schau in deine Sammlung – und stell heute Abend die Stiefel raus.' },
    ],
    junior: [{ type: 'mission', text: 'Stell deinen Stiefel vor die Tür und hilf Marlo mit seinem!', shells: 1 }],
  },
  {
    id: 16, date: '2026-12-06', title: 'Nikolaus', emoji: '🎅', phase: 'endspurt',
    steps: [
      { type: 'hint', title: 'Schau in deinen Stiefel', text: 'Der Nikolaus war da – und er hat etwas dagelassen, das du für die Reise brauchst. Das Codewort hängt dran.' },
      { type: 'quiz', q: 'Seit 2009 ist ganz Fuerteventura …', options: ['autofrei', 'UNESCO-Biosphärenreservat', 'ein Nationalpark', 'zollfrei'], answer: 1, points: 10 },
    ],
    junior: [{ type: 'mission', text: 'Schau in deinen Stiefel! Da ist ein Bildercode drin – tipp ihn auf der Startseite ein.', shells: 1 }],
  },
  {
    id: 17, date: '2026-12-07', title: 'Fast da', emoji: '🌴', phase: 'endspurt',
    steps: [
      { type: 'choice', q: 'Das erste Abendessen auf der Insel:', a: '🐟 Frischer Fisch am Hafen', b: '🥘 Paella mit Meerblick', points: 5, note: 'Tisch wird reserviert.' },
      { type: 'open', q: 'Worauf freust du dich gerade am allermeisten?', points: 10, placeholder: 'Auf …' },
    ],
    junior: [
      { type: 'tap', q: 'Wie viele Leute fliegen mit?', shells: 1,
        options: [{ emoji: '2️⃣', label: 'Zwei' }, { emoji: '4️⃣', label: 'Vier', ok: true }, { emoji: '🔟', label: 'Zehn' }] },
    ],
  },
  {
    id: 18, date: '2026-12-08', title: 'Der letzte Abend', emoji: '🌙', phase: 'endspurt',
    steps: [
      { type: 'hint', title: 'Heute Abend, wenn die Jungs schlafen', text: 'Die Koffer stehen bereit. Auf dem Sofa wartet Umschlag Nummer 1. Das Finale beginnt.' },
    ],
    junior: [{ type: 'mission', text: 'Leg deine Sachen für morgen bereit – wir stehen mitten in der Nacht auf wie echte Abenteurer!', shells: 2 }],
  },
]

// ---------------------------------------------------------------------------
//  CODES – stehen auf Kärtchen an den Geschenken und in den Umschlägen.
//  Druckbogen: App mit ?demo=1 öffnen → Werkzeug → „Druckbogen“.
//  Das Codewort für Umschlag 3 steht NICHT hier (siehe README, „Geheime Überraschung“).
// ---------------------------------------------------------------------------
export const codes: Code[] = [
  { code: 'KNUSPER', kind: 'text', label: 'Sa 14.11. · Brotchips (Kleiderschrank)', points: 15, message: 'Knusperzeit! Das war erst der Anfang.' },
  { code: 'PUDDING', kind: 'text', label: 'So 15.11. · 3 Tassenpuddings (Küchenschrank)', points: 15, message: 'Tasse, heißes Wasser, Sofa. Lasst es euch schmecken, ihr drei.' },
  { code: 'MILCHREIS', kind: 'text', label: 'Di 17.11. · Milchreis (Vorratsschrank)', points: 15, message: 'Guten Appetit! Heute Abend bin ich wieder da.' },
  { code: 'MILANO', kind: 'text', label: 'Mi 18.11. · Mitbringsel aus Mailand', points: 15, collectible: 'milano', message: 'Ein Stück Mailand für dich. Schön, wieder zu Hause zu sein.' },
  { code: 'NIKOLAUS', kind: 'text', label: 'So 6.12. · Stiefel Milena (goldener Schlüssel)', points: 20, collectible: 'schluessel', message: 'Der goldene Schlüssel! Heb ihn gut auf – du brauchst ihn über den Wolken.' },
  { code: 'ABENDSONNE', kind: 'text', label: 'Di 8.12. · Umschlag 1 (Sofa)', stage: 1, message: 'Etappe 1 ist offen. Das Finale beginnt!' },
  { code: 'GATE', kind: 'text', label: 'Mi 9.12. · Umschlag 2 (Flughafen)', stage: 2, message: 'Etappe 2 ist offen. Deine Bordkarte wartet.' },
  { code: '🚗🐐☀️', kind: 'pic', label: 'Sa 14.11. · Hot-Wheels-Kratzheft (Leanos Gummistiefel)', shells: 2, message: 'Super, Leano! Zwei Muscheln für dich und Marlo.' },
  { code: '🐚🌴🍦', kind: 'pic', label: 'Mo 16.11. · Pixibuch (Papas Turnschuh)', shells: 2, message: 'Gefunden! Zwei Muscheln – und heute Abend gibt es die Geschichte.' },
  { code: '🎅🐚⭐', kind: 'pic', label: 'So 6.12. · Stiefel der Jungs', shells: 3, message: 'Der Nikolaus schickt drei Muscheln!' },
  { code: '✈️🚗🌴', kind: 'pic', label: 'Mi 9.12. · Umschlag der Jungs (Flughafen)', shells: 3, message: 'Guten Flug, ihr zwei Abenteurer!' },
]
export const picPalette = ['🚗', '🐐', '☀️', '🎅', '🐚', '⭐', '✈️', '🌴', '🍦']

// ---------------------------------------------------------------------------
//  SAMMELOBJEKTE
// ---------------------------------------------------------------------------
export const collectibles: Record<string, { emoji: string; title: string; text: string }> = {
  karte1: { emoji: '🗺️', title: 'Kartenstück 1', text: 'Ein Stück Küste.' },
  karte2: { emoji: '🗺️', title: 'Kartenstück 2', text: 'Ein Weg durch die Dünen.' },
  karte3: { emoji: '🗺️', title: 'Kartenstück 3', text: 'Eine kleine Bucht.' },
  karte4: { emoji: '🗺️', title: 'Kartenstück 4', text: 'Ein Leuchtturm?' },
  karte5: { emoji: '🗺️', title: 'Kartenstück 5', text: 'Palmen am Wasser.' },
  karte6: { emoji: '🗺️', title: 'Kartenstück 6', text: 'Ein Berg im Dunst.' },
  karte7: { emoji: '🗺️', title: 'Kartenstück 7', text: 'Das Kreuz. Hier ist es.' },
  muschel: { emoji: '🐚', title: 'Die Muschel', text: 'Öffnet ein Geheimregal im Urlaubsshop.' },
  milano: { emoji: '🇮🇹', title: 'Gruß aus Mailand', text: 'Papa ist wieder da.' },
  schluessel: { emoji: '🗝️', title: 'Goldener Schlüssel', text: 'Für das letzte Schloss – über den Wolken.' },
}
export const mapPieces = ['karte1', 'karte2', 'karte3', 'karte4', 'karte5', 'karte6', 'karte7']
export const mapComplete = 'Die Karte ist komplett. Das Kreuz liegt an einem Ort, den du erst über den Wolken erfährst …'

// ---------------------------------------------------------------------------
//  SHOP – „zuhause“ ist sofort kaufbar, „urlaub“ erst im Finale (vorher Wunschliste)
// ---------------------------------------------------------------------------
export const rewards: Reward[] = [
  { id: 'filmabend', emoji: '🎬', title: 'Filmabend – du suchst aus, ich hole die Snacks', price: 20, where: 'zuhause', multi: true },
  { id: 'bettrunde', emoji: '🌙', title: 'Papa bringt die Jungs allein ins Bett', price: 20, where: 'zuhause', multi: true },
  { id: 'bettfruehstueck', emoji: '🥐', title: 'Frühstück ans Bett', price: 30, where: 'zuhause' },
  { id: 'ausschlafen-daheim', emoji: '😴', title: 'Ausschlafen am Wochenende', price: 40, where: 'zuhause' },
  { id: 'massage-daheim', emoji: '💆‍♀️', title: 'Massage von Papa (30 Minuten)', price: 40, where: 'zuhause' },
  { id: 'freizeit', emoji: '☕', title: 'Zwei Stunden nur für dich – Papa hat die Jungs', price: 50, where: 'zuhause' },
  { id: 'eisrunde', emoji: '🍦', title: 'Eis-Runde für alle', price: 20, where: 'urlaub', multi: true },
  { id: 'churros', emoji: '🥨', title: 'Churros con Chocolate für alle', price: 20, where: 'urlaub', multi: true },
  { id: 'ausschlafen-urlaub', emoji: '😴', title: 'Ausschlafen – Papa frühstückt mit den Jungs', price: 40, where: 'urlaub', multi: true },
  { id: 'souvenir', emoji: '🛍️', title: 'Ein Souvenir deiner Wahl', price: 40, where: 'urlaub' },
  { id: 'joker', emoji: '🃏', title: 'Joker: Du bestimmst das Tagesprogramm', price: 50, where: 'urlaub' },
  { id: 'familienfoto', emoji: '📸', title: 'Familienfotos am Strand bei Sonnenuntergang', price: 50, where: 'urlaub' },
  { id: 'paella', emoji: '🥘', title: 'Paella-Abend für die ganze Familie', price: 60, where: 'urlaub' },
  { id: 'wellness', emoji: '💆‍♀️', title: 'Massage oder Wellness-Auszeit', price: 90, where: 'urlaub' },
  { id: 'ausflug', emoji: '🦒', title: 'Familienausflug deiner Wahl (z. B. Tierpark)', price: 100, where: 'urlaub' },
  { id: 'boot', emoji: '⛵', title: 'Bootstour zur Isla de Lobos', price: 120, where: 'urlaub', hiddenUntil: 'muschel' },
]

// Die Jungs müssen nichts kaufen: Belohnungen schalten sich mit den Muscheln frei.
export const kidsRewards = [
  { at: 5, emoji: '🍦', title: 'Ein Rieseneis im Urlaub' },
  { at: 12, emoji: '🏰', title: 'Papa baut die größte Sandburg der Insel' },
  { at: 20, emoji: '🌙', title: 'Einmal länger aufbleiben' },
]

// ---------------------------------------------------------------------------
//  FINALE
//  Etappe 1: Vorabend auf dem Sofa (letzte Challenge + Shop öffnet)
//  Etappe 2: Flughafen (Bordkarte mit allen Gutscheinen, Umschlag der Jungs)
//  Etappe 3: Im Flugzeug (goldener Schlüssel + Codewort aus Umschlag 3, offline)
// ---------------------------------------------------------------------------
export const finale = {
  stage1: {
    title: 'Der letzte Abend', where: 'Auf dem Sofa, Koffer gepackt',
    steps: [
      { type: 'quiz', q: 'Wie viele Türchen hast du in den letzten Wochen geöffnet?', options: ['14', '16', '18', '25'], answer: 2, points: 10 },
      { type: 'open', q: 'Dein schönster Moment aus diesem Countdown?', points: 20, placeholder: 'Am schönsten war …' },
    ] as Step[],
    done: 'Der Urlaubsshop ist jetzt geöffnet. Gib deine Sonnenpunkte aus!',
  },
  stage2: { title: 'Bordkarte', where: 'Am Flughafen', text: 'Hier sind deine erspielten Urlaubserlebnisse. Sie fliegen mit.' },
  stage3: {
    title: 'Über den Wolken', where: 'Im Flugzeug',
    text: 'Das letzte Schloss. Du brauchst den goldenen Schlüssel und das Codewort aus Umschlag 3.',
    // Mit `npm run encrypt -- "CODEWORT" "Text"` erzeugen und hier einfügen.
    // Platzhalter-Codewort für den Prototyp: LEUCHTTURM
    secret: { s: 'tY09X6EeHommPSWu9Mn44A==', i: 'hQNlJw/y6gzjevw5', c: 'f/RSEG4eTzIbw3renkEyMh5OYzIIiF9GQv3utwvu37MYTJkq/tzO/Vz/Y7thpEAlYiocaHL+nKi27WjzmvsfMqm6xu1QQSpFO0Njdpe5M6GE7UXhdzUIXAi8QqisWhJZzrdlqwqjSXVVs7TtoEpT+Ne+XTllw6WGKa/1k705L0FUMoSdBGGmFUDH5BJFBqQLqkpMQe/IwuQqSo3BRSP02PDK+kFqeX36b/GftrN3j6Z49pukH+BYOpGlfvRGjOrHRZn168Jak2G8ZzwH1Gw1ynMyW2HRtrQEyvaIwGBRPZqv6lta+mJJKw==' },
  },
}
