import { useEffect, useState } from 'react'
import type { View } from '../App'
import { collectibles, config, doors } from '../config'
import { Runner } from '../steps/Steps'
import { doorDone, juniorDone, useGame } from '../store'

export default function DoorView({ id, go }: { id: number; go: (v: View) => void }) {
  const s = useGame()
  const door = doors.find((d) => d.id === id)!
  const [tab, setTab] = useState<'mama' | 'junior'>('mama')
  const done = doorDone(s, id)

  useEffect(() => {
    if (done && door.collectible) s.grant(door.collectible)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const res = door.steps.map((_, i) => s.results[`d${id}:${i}`])
  const points = res.reduce((a, r) => a + (r?.points ?? 0), 0)
  const jShells = (door.junior ?? []).reduce((a, _, i) => a + (s.results[`d${id}j:${i}`]?.shells ?? 0), 0)
  const answers = door.steps
    .map((st, i) => ((st.type === 'open' || st.type === 'choice') && res[i]?.data ? `${st.q} → ${res[i]!.data}` : null))
    .filter(Boolean)
  const share = encodeURIComponent(
    [`☀️ Türchen ${id} „${door.title}“ geschafft! +${points} Sonnenpunkte.`, ...answers].join('\n'),
  )
  const hints = door.steps.filter((st) => st.type === 'hint')
  const item = door.collectible ? collectibles[door.collectible] : null

  return (
    <>
      <button className="link back" onClick={() => go({ name: 'home' })}>‹ Zurück</button>
      <div className="door-head">
        <span className="bigemoji">{door.emoji}</span>
        <div>
          <small>Türchen {id}</small>
          <h1>{door.title}</h1>
        </div>
      </div>

      {door.junior && (
        <div className="seg">
          <button className={tab === 'mama' ? 'on' : ''} onClick={() => setTab('mama')}>☀️ {config.family.mama} {done && '✓'}</button>
          <button className={tab === 'junior' ? 'on' : ''} onClick={() => setTab('junior')}>🐚 {config.family.kids} {juniorDone(s, id) && '✓'}</button>
        </div>
      )}

      {tab === 'mama' ? (
        <Runner key="mama" scope={`d${id}`} steps={door.steps}>
          <div className="card summary">
            <div className="bigemoji">🎉</div>
            <h2>Geschafft!</h2>
            <p className="big">+{points} ☀️</p>
            {item && <p className="found">{item.emoji} Neu in deiner Sammlung: <b>{item.title}</b></p>}
            {hints.map((h, i) => h.type === 'hint' && (
              <div className="hint mini" key={i}><b>🎁 {h.title}</b><p>{h.text}</p></div>
            ))}
            <a className="btn wa" target="_blank" rel="noreferrer" href={`https://wa.me/${config.papaWhatsApp}?text=${share}`}>
              An {config.family.papa} senden
            </a>
            {door.junior && !juniorDone(s, id) && (
              <button className="btn ghost" onClick={() => setTab('junior')}>Jetzt sind {config.family.kids} dran →</button>
            )}
          </div>
        </Runner>
      ) : (
        <Runner key="junior" scope={`d${id}j`} steps={door.junior!}>
          <div className="card summary kidsum">
            <div className="bigemoji">🐚</div>
            <h2>Super gemacht, {config.family.big}!</h2>
            <p className="big">+{jShells} Muscheln</p>
            <button className="btn kidbtn" onClick={() => go({ name: 'home' })}>Zurück zur Insel</button>
          </div>
        </Runner>
      )}
    </>
  )
}
