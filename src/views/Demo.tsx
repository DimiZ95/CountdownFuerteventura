import { useState } from 'react'
import type { View } from '../App'
import { codes, config } from '../config'
import { now, useGame } from '../store'

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

/** Nur mit ?demo=1 sichtbar: Datum simulieren, Punkte setzen, alles zurücksetzen. */
export function DemoPanel({ go }: { go: (v: View) => void }) {
  const s = useGame()
  const [open, setOpen] = useState(false)
  const n = now(s)
  const shift = (days: number) => s.setDemo({ demoDate: iso(new Date(n.getTime() + days * 864e5)) })
  if (!open) return <button className="demo-fab" onClick={() => setOpen(true)} aria-label="Demo-Werkzeug">🛠</button>
  return (
    <div className="demo">
      <header><b>Demo-Modus</b><button className="link" onClick={() => setOpen(false)}>Schließen</button></header>
      <label>Simuliertes Datum
        <input type="datetime-local" value={iso(n)} onChange={(e) => e.target.value && s.setDemo({ demoDate: e.target.value })} />
      </label>
      <div className="demo-grid">
        <button onClick={() => shift(-1)}>− 1 Tag</button>
        <button onClick={() => shift(1)}>+ 1 Tag</button>
        <button onClick={() => s.setDemo({ demoDate: '2026-11-14T07:00' })}>Start 14.11.</button>
        <button onClick={() => s.setDemo({ demoDate: '2026-12-08T20:00' })}>Vorabend</button>
        <button onClick={() => s.setDemo({ demoDate: null })}>Echtes Datum</button>
        <button onClick={() => s.addBonus(50, 0)}>+50 ☀️</button>
        <button onClick={() => s.addBonus(0, 5)}>+5 🐚</button>
        <button onClick={() => { s.grant('schluessel'); s.grant('muschel') }}>Schlüssel + Muschel</button>
        <button onClick={() => { setOpen(false); go({ name: 'print' }) }}>Druckbogen</button>
        <button className="danger" onClick={() => confirm('Wirklich den ganzen Spielstand löschen?') && s.reset()}>Zurücksetzen</button>
      </div>
      <small>Ausschalten: Adresse mit ?demo=0 öffnen.</small>
    </div>
  )
}

/** Kärtchen für Geschenke und Umschläge zum Ausdrucken und Ausschneiden. */
export function PrintSheet({ back }: { back: () => void }) {
  return (
    <div className="print">
      <div className="noprint">
        <button className="btn small" onClick={back}>‹ Zurück</button>
        <button className="btn small" onClick={() => window.print()}>Drucken</button>
        <p>Ausschneiden und an Geschenke bzw. in die Umschläge legen. Die graue Zeile ist nur für dich – abschneiden!</p>
      </div>
      <div className="cards">
        {codes.map((c) => (
          <div className="pcard" key={c.code}>
            <em>{c.label}</em>
            <span>{c.kind === 'pic' ? `Für ${config.family.kids}` : 'Dein Codewort'}</span>
            <b className={c.kind}>{c.code}</b>
            <small>In der App unter „Code einlösen“ {c.kind === 'pic' ? 'antippen' : 'eingeben'}</small>
          </div>
        ))}
        <div className="pcard">
          <em>Mi 9.12. · Umschlag 3 (Flugzeug)</em>
          <span>Dein Codewort</span>
          <b className="text blank">&nbsp;</b>
          <small>Von Hand eintragen – dieses Wort steht nirgends in der App</small>
        </div>
      </div>
    </div>
  )
}
