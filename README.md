# Fuerteventura Abenteuer ☀️

Countdown-App bis zum Abflug am 9.12.2026: 18 Türchen ab dem 14.11., Sonnenpunkte für Mama,
Muscheln für Leano & Marlo, Urlaubsshop mit Gutscheinen und ein Finale mit drei Umschlägen.

## Starten

```bash
npm install
npm run dev      # lokal entwickeln
npm run build    # fertige App nach dist/
```

## Inhalte anpassen

Alles steht in **`src/config.ts`**: Türchen, Fragen, Punkte, Verstecke, Codes, Shop-Preise, Daten.
Platzhalter sind mit `TODO` markiert.

- **Sprachnachrichten:** Dateien nach `public/audio/` legen (Namen wie in der Config, z. B. `tag1-mama.m4a`).
  Fehlt eine Datei, zeigt die App nur den Text.
- **Codes:** Kärtchen an Geschenken und in Umschlägen. Eingabe auf der Startseite unter „Code einlösen“.
  Für die Jungs gibt es Bildercodes aus drei Symbolen.
- **Geheime Überraschung (Umschlag 3):** Der Text liegt nur verschlüsselt in der App.
  `npm run encrypt -- "DEINCODEWORT" "Dein Text"` ausführen und die Ausgabe in `finale.stage3.secret`
  einfügen. Das Codewort steht nirgends im Code – nur in Umschlag 3. Im Prototyp lautet es `LEUCHTTURM`.

## Demo-Modus

Adresse mit `?demo=1` öffnen: Das Werkzeug 🛠 simuliert jedes Datum, vergibt Punkte, öffnet den
Druckbogen für die Code-Kärtchen und setzt den Spielstand zurück. Mit `?demo=0` wieder ausschalten.

## Veröffentlichen

Ein Push auf `main` baut und veröffentlicht die App über GitHub Pages
(einmalig aktivieren: Settings → Pages → Source: „GitHub Actions“).

Hinweis: Der Spielstand liegt nur im Browser des Handys. Immer denselben Browser benutzen oder die
Seite zum Home-Bildschirm hinzufügen.
