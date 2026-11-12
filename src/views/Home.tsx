import { useEffect, useState } from 'react'
import type { View } from '../App'
import { config, doors, finale, picPalette, type Door } from '../config'
import { decrypt } from '../crypto'
import { party } from '../fx'
import { balance, doorDone, doorTime, findCode, isUnlocked, juniorDone, norm, now, shells, useGame } from '../store'

const phases: Record<Door['phase'], string> = {
  mailand: 'Papa in Mailand',
  inselpost: 'Inselpost',
  endspurt: 'Endspurt',
}
const dayFmt = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' })

function useNow() {
  const s = useGame()
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 30000)
    return () => clearInterval(t)
  }, [])
  return now(s)
}

function Weather() {
  const [t, setT] = useState<{ island: number; home: number } | null>(null)
  useEffect(() => {
    const cached = sessionStorage.getItem('wetter')
    if (cached) { setT(JSON.parse(cached)); return }
    const get = (p: { lat: number; lon: number }) =>
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m`)
        .then((r) => r.json())
        .then((j) => Math.round(j.current.temperature_2m as number))
    Promise.all([get(config.island), get(config.home)])
      .then(([island, home]) => {
        const v = { island, home }
        sessionStorage.setItem('wetter', JSON.stringify(v))
        setT(v)
      })
      .catch(() => {}) // offline: einfach nichts anzeigen
  }, [])
  if (!t) return null
  return (
    <div className="weather">
      <span>☀️ {config.island.name} <b>{t.island} °C</b></span>
      <span>🌧️ {config.home.name} <b>{t.home} °C</b></span>
    </div>
  )
}

/** Ein Eingabefeld für alle Codes: Geschenk-Kärtchen, Umschläge und Bildcodes der Jungs. */
export function CodeBox() {
  const s = useGame()
  const [mode, setMode] = useState<'text' | 'pic'>('text')
  const [val, setVal] = useState('')
  const [pics, setPics] = useState<string[]>([])
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (input: string) => {
    const c = findCode(input)
    if (c) {
      if (s.codes.includes(c.code)) return setMsg({ ok: false, text: 'Diesen Code hast du schon eingelöst.' })
      s.redeemCode(c)
      party()
      const plus = [c.points && `+${c.points} ☀️`, c.shells && `+${c.shells} 🐚`].filter(Boolean).join(' ')
      setVal(''); setPics([])
      return setMsg({ ok: true, text: `${c.message} ${plus}` })
    }
    const secret = await decrypt(finale.stage3.secret, norm(input))
    if (secret) {
      if (!s.collectibles.includes('schluessel'))
        return setMsg({ ok: false, text: 'Dieses Schloss braucht den goldenen Schlüssel …' })
      s.unlockStage(3, secret)
      party()
      setVal('')
      return setMsg({ ok: true, text: 'Das letzte Schloss ist offen. Schau ins Finale!' })
    }
    setMsg({ ok: false, text: `Diesen Code kennt ${config.mascot.name} nicht. Noch mal schauen?` })
  }

  return (
    <div className="card codebox">
      <div className="seg">
        <button className={mode === 'text' ? 'on' : ''} onClick={() => { setMode('text'); setMsg(null) }}>🔑 Codewort</button>
        <button className={mode === 'pic' ? 'on' : ''} onClick={() => { setMode('pic'); setMsg(null) }}>🖼️ Bildercode</button>
      </div>
      {mode === 'text' ? (
        <form onSubmit={(e) => { e.preventDefault(); if (val.trim()) submit(val) }}>
          <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Codewort vom Kärtchen" autoCapitalize="characters" autoCorrect="off" />
          <button className="btn small" disabled={!val.trim()}>Einlösen</button>
        </form>
      ) : (
        <>
          <div className="picslots">
            {[0, 1, 2].map((i) => <span key={i}>{pics[i] ?? '·'}</span>)}
            <button className="link" onClick={() => setPics([])}>Löschen</button>
          </div>
          <div className="picpad">
            {picPalette.map((p) => (
              <button key={p} onClick={() => {
                if (pics.length >= 3) return
                const next = [...pics, p]
                setPics(next)
                if (next.length === 3) submit(next.join(''))
              }}>{p}</button>
            ))}
          </div>
        </>
      )}
      {msg && <p className={`msg ${msg.ok ? 'ok' : 'no'}`}>{msg.text}</p>}
    </div>
  )
}

function Scissors({ door, onCut, onClose }: { door: Door; onCut: () => void; onClose: () => void }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (v >= 96) { const t = setTimeout(onCut, 350); return () => clearTimeout(t) }
  }, [v, onCut])
  return (
    <div className="overlay" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <div className="bigemoji">{door.emoji}</div>
        <h2>Türchen {door.id}</h2>
        <p>Schon ein Stück vom Zettel abgeschnitten? Dann schneid auch hier einmal durch.</p>
        <div className="cut" style={{ ['--v' as string]: `${v}%` }}>
          <input type="range" min={0} max={100} value={v} aria-label="Zum Öffnen nach rechts schneiden"
            onChange={(e) => setV(Number(e.target.value))}
            onPointerUp={() => v < 96 && setV(0)} onTouchEnd={() => v < 96 && setV(0)} />
        </div>
        <button className="link" onClick={onClose}>Später</button>
      </div>
    </div>
  )
}

export default function Home({ go }: { go: (v: View) => void }) {
  const s = useGame()
  const n = useNow()
  const [cut, setCut] = useState<Door | null>(null)
  const [showCode, setShowCode] = useState(false)

  const ms = new Date(config.departure).getTime() - n.getTime()
  const days = Math.max(0, Math.floor(ms / 864e5))
  const hours = Math.max(0, Math.floor((ms % 864e5) / 36e5))
  const doneCount = doors.filter((d) => doorDone(s, d.id)).length
  const color = doneCount / doors.length // die Insel wird mit jedem Türchen bunter

  const today = doors.find((d) => d.date === `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`)
  const next = doors.find((d) => !isUnlocked(d.date, n))
  const openTodo = doors.filter((d) => isUnlocked(d.date, n) && !doorDone(s, d.id))
  const majo =
    ms <= 0 ? 'Wir fliegen! Schau ins Finale.'
    : openTodo.length ? `${openTodo.length === 1 ? 'Ein Türchen wartet' : `${openTodo.length} Türchen warten`} auf dich. Kein Stress – nichts verfällt.`
    : today ? 'Für heute alles geschafft. Stark!'
    : next ? `Heute ist Pause. Das nächste Türchen öffnet sich am ${dayFmt.format(doorTime(next.date))}.`
    : 'Alle Türchen sind offen. Gleich geht es los!'

  return (
    <>
      <header className="hero">
        <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" style={{ filter: `grayscale(${1 - color}) brightness(${0.92 + color * 0.08})` }} aria-hidden>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7fd8e6" /><stop offset="1" stopColor="#fde9b8" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#sky)" />
          <circle cx="310" cy={110 - color * 55} r="34" fill="#ffb627" />
          <path d="M0 150 Q60 95 130 140 T260 130 T400 150 V220 H0Z" fill="#d9a15c" opacity=".55" />
          <path d="M0 165 Q100 140 200 165 T400 160 V220 H0Z" fill="#19b5b0" />
          <path d="M0 185 Q120 160 240 190 T400 180 V220 H0Z" fill="#f4d79a" />
          <text x="60" y="200" fontSize="30">🌴</text>
          <text x="118" y="206" fontSize="22">{config.mascot.emoji}</text>
        </svg>
        <div className="hero-text">
          <p>Fuerteventura</p>
          <h1>{ms <= 0 ? 'Abflug!' : days > 0 ? `Noch ${days} ${days === 1 ? 'Tag' : 'Tage'}` : `Noch ${hours} Std.`}</h1>
          {days > 0 && <small>und {hours} Stunden bis zum Abflug</small>}
        </div>
      </header>

      <Weather />

      <section className="stats">
        <button className="stat" onClick={() => go({ name: 'shop' })}>
          <b>{balance(s)}</b><span>☀️ Sonnenpunkte</span>
        </button>
        <button className="stat kidstat" onClick={() => go({ name: 'shop' })}>
          <b>{shells(s)}</b><span>🐚 Muscheln der Jungs</span>
        </button>
      </section>

      <div className="majo home-majo"><span className="majo-face">{config.mascot.emoji}</span><p>{majo}</p></div>

      <button className="btn ghost" onClick={() => setShowCode(!showCode)}>🔑 Code einlösen</button>
      {showCode && <CodeBox />}

      {(Object.keys(phases) as Door['phase'][]).map((ph) => (
        <section key={ph}>
          <h2 className="phase">{phases[ph]}</h2>
          <div className="doors">
            {doors.filter((d) => d.phase === ph).map((d) => {
              const unlocked = isUnlocked(d.date, n)
              const opened = s.opened.includes(d.id)
              const done = doorDone(s, d.id) && juniorDone(s, d.id)
              return (
                <button key={d.id} disabled={!unlocked}
                  className={`door ${!unlocked ? 'locked' : done ? 'done' : opened ? 'open' : 'ready'} ${today?.id === d.id ? 'today' : ''}`}
                  onClick={() => (opened ? go({ name: 'door', id: d.id }) : setCut(d))}>
                  <span className="door-emoji">{unlocked ? d.emoji : '🔒'}</span>
                  <b>{d.id}</b>
                  <small>{done ? '✓ geschafft' : dayFmt.format(doorTime(d.date))}</small>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      {cut && (
        <Scissors door={cut} onClose={() => setCut(null)}
          onCut={() => { s.openDoor(cut.id); party(); const id = cut.id; setCut(null); go({ name: 'door', id }) }} />
      )}
    </>
  )
}
