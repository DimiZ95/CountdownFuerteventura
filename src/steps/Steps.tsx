import { useEffect, useMemo, useState } from 'react'
import { config, type Step } from '../config'
import { useGame, type Result } from '../store'
import { party, sparkle } from '../fx'

type Done = (r: Result) => void
const asset = (src: string) => `${import.meta.env.BASE_URL}${src}`

/** Spielt Papas Stimme ab, wenn die Datei existiert – sonst bleibt nur der Text. */
function Voice({ src }: { src?: string }) {
  const [ok, setOk] = useState(true)
  if (!src || !ok) return null
  return <audio className="voice" controls preload="none" src={asset(src)} onError={() => setOk(false)} />
}

function Majo({ children }: { children: React.ReactNode }) {
  return (
    <div className="majo">
      <span className="majo-face">{config.mascot.emoji}</span>
      <p>{children}</p>
    </div>
  )
}

function Audio({ step, done }: { step: Extract<Step, { type: 'audio' }>; done: Done }) {
  return (
    <>
      <h3>🎙️ {step.title}</h3>
      <Voice src={step.src} />
      <p className="letter">{step.text}</p>
      <button className="btn" onClick={() => done({ points: 0, shells: 0 })}>Weiter</button>
    </>
  )
}

function Quiz({ step, done }: { step: Extract<Step, { type: 'quiz' }>; done: Done }) {
  const [wrong, setWrong] = useState<number[]>([])
  const [won, setWon] = useState<number | null>(null)
  const over = won !== null
  const pick = (i: number) => {
    if (over || wrong.includes(i)) return
    if (i === step.answer) {
      setWon(wrong.length === 0 ? step.points : Math.ceil(step.points / 2))
      sparkle()
    } else if (wrong.length >= 1) {
      setWrong([...wrong, i])
      setWon(config.consolationPoints)
    } else setWrong([...wrong, i])
  }
  return (
    <>
      <h3>{step.q}</h3>
      <div className="options">
        {step.options.map((o, i) => (
          <button key={i} onClick={() => pick(i)}
            className={`option ${over && i === step.answer ? 'right' : ''} ${wrong.includes(i) ? 'wrong' : ''}`}>
            {o}
          </button>
        ))}
      </div>
      {!over && wrong.length === 1 && <Majo>Knapp daneben! Ein Versuch geht noch.</Majo>}
      {over && (
        <>
          <Majo>
            {won === config.consolationPoints ? 'Macht nichts – Trostpunkte gibt es trotzdem. ' : 'Richtig! '}
            {step.fact}
          </Majo>
          <button className="btn" onClick={() => done({ points: won!, shells: 0 })}>+{won} ☀️ einsammeln</button>
        </>
      )}
    </>
  )
}

function Estimate({ step, done }: { step: Extract<Step, { type: 'estimate' }>; done: Done }) {
  const [val, setVal] = useState('')
  const [won, setWon] = useState<number | null>(null)
  const check = () => {
    const diff = Math.abs(Number(val.replace(',', '.')) - step.answer)
    const p = diff <= step.tolerance ? step.points : diff <= step.tolerance * 2 ? Math.ceil(step.points / 2) : config.consolationPoints
    setWon(p)
    if (p > config.consolationPoints) sparkle()
  }
  return (
    <>
      <h3>{step.q}</h3>
      <div className="estimate">
        <input inputMode="decimal" value={val} disabled={won !== null} onChange={(e) => setVal(e.target.value)} placeholder="Dein Tipp" />
        <span>{step.unit}</span>
      </div>
      {won === null ? (
        <button className="btn" disabled={!val.trim() || isNaN(Number(val.replace(',', '.')))} onClick={check}>Schätzen</button>
      ) : (
        <>
          <Majo>Richtig wären {step.answer} {step.unit}. {step.fact}</Majo>
          <button className="btn" onClick={() => done({ points: won, shells: 0, data: val })}>+{won} ☀️ einsammeln</button>
        </>
      )}
    </>
  )
}

function Choice({ step, done }: { step: Extract<Step, { type: 'choice' }>; done: Done }) {
  const [pick, setPick] = useState<string | null>(null)
  return (
    <>
      <h3>{step.q}</h3>
      <div className="options">
        {[step.a, step.b].map((o) => (
          <button key={o} className={`option big ${pick === o ? 'right' : ''}`} onClick={() => setPick(o)}>{o}</button>
        ))}
      </div>
      {pick && (
        <>
          {step.note && <Majo>{step.note}</Majo>}
          <button className="btn" onClick={() => done({ points: step.points, shells: 0, data: pick })}>+{step.points} ☀️ einsammeln</button>
        </>
      )}
    </>
  )
}

function Open({ step, done }: { step: Extract<Step, { type: 'open' }>; done: Done }) {
  const [val, setVal] = useState('')
  return (
    <>
      <h3>{step.q}</h3>
      <textarea rows={3} value={val} onChange={(e) => setVal(e.target.value)} placeholder={step.placeholder} />
      <button className="btn" disabled={val.trim().length < 2} onClick={() => done({ points: step.points, shells: 0, data: val.trim() })}>
        +{step.points} ☀️ einsammeln
      </button>
    </>
  )
}

function Memory({ step, done }: { step: Extract<Step, { type: 'memory' }>; done: Done }) {
  const deck = useMemo(
    () => [...step.cards, ...step.cards].map((e, i) => ({ e, i, r: Math.random() })).sort((a, b) => a.r - b.r),
    [step.cards],
  )
  const [open, setOpen] = useState<number[]>([])
  const [found, setFound] = useState<string[]>([])
  const complete = found.length === step.cards.length
  useEffect(() => {
    if (open.length !== 2) return
    const [a, b] = open.map((i) => deck.find((c) => c.i === i)!)
    if (a.e === b.e) {
      setFound((f) => [...f, a.e])
      setOpen([])
      return
    }
    const t = setTimeout(() => setOpen([]), 800)
    return () => clearTimeout(t)
  }, [open, deck])
  useEffect(() => { if (complete) sparkle() }, [complete])
  return (
    <>
      <h3>🃏 {step.title}</h3>
      <div className="memory">
        {deck.map((c) => {
          const up = open.includes(c.i) || found.includes(c.e)
          return (
            <button key={c.i} className={`mcard ${up ? 'up' : ''}`} aria-label={up ? c.e : 'Verdeckte Karte'}
              onClick={() => !up && open.length < 2 && setOpen([...open, c.i])}>
              {up ? c.e : '☀️'}
            </button>
          )
        })}
      </div>
      {complete && <button className="btn" onClick={() => done({ points: step.points, shells: 0 })}>+{step.points} ☀️ einsammeln</button>}
    </>
  )
}

function Hint({ step, done }: { step: Extract<Step, { type: 'hint' }>; done: Done }) {
  return (
    <>
      <div className="hint">
        <span>🎁</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
      <button className="btn" onClick={() => done({ points: 0, shells: 0 })}>Alles klar</button>
    </>
  )
}

function Tap({ step, done }: { step: Extract<Step, { type: 'tap' }>; done: Done }) {
  const [shake, setShake] = useState<number | null>(null)
  const [ok, setOk] = useState(false)
  return (
    <>
      <Voice src={step.src} />
      <h3 className="kid">{step.q}</h3>
      <div className="taps">
        {step.options.map((o, i) => (
          <button key={i} className={`tap ${shake === i ? 'shake' : ''} ${ok && o.ok ? 'right' : ''}`}
            onClick={() => {
              if (ok) return
              if (o.ok) { setOk(true); sparkle() } else { setShake(i); setTimeout(() => setShake(null), 500) }
            }}>
            <span>{o.emoji}</span>
            <small>{o.label}</small>
          </button>
        ))}
      </div>
      {shake !== null && <Majo>Hihi, das nicht. Probier noch mal!</Majo>}
      {ok && <button className="btn kidbtn" onClick={() => done({ points: 0, shells: step.shells })}>+{step.shells} 🐚 Super!</button>}
    </>
  )
}

function Mission({ step, done }: { step: Extract<Step, { type: 'mission' }>; done: Done }) {
  return (
    <>
      <Voice src={step.src} />
      <div className="hint kidhint">
        <span>⭐</span>
        <p className="kid">{step.text}</p>
      </div>
      <button className="btn kidbtn" onClick={() => { sparkle(); done({ points: 0, shells: step.shells }) }}>
        Geschafft! +{step.shells} 🐚
      </button>
    </>
  )
}

function StepView({ step, done }: { step: Step; done: Done }) {
  switch (step.type) {
    case 'audio': return <Audio step={step} done={done} />
    case 'quiz': return <Quiz step={step} done={done} />
    case 'estimate': return <Estimate step={step} done={done} />
    case 'choice': return <Choice step={step} done={done} />
    case 'open': return <Open step={step} done={done} />
    case 'memory': return <Memory step={step} done={done} />
    case 'hint': return <Hint step={step} done={done} />
    case 'tap': return <Tap step={step} done={done} />
    case 'mission': return <Mission step={step} done={done} />
  }
}

/** Führt nacheinander durch die Schritte eines Bereichs und merkt sich jedes Ergebnis. */
export function Runner({ scope, steps, children }: { scope: string; steps: Step[]; children: React.ReactNode }) {
  const results = useGame((s) => s.results)
  const record = useGame((s) => s.record)
  const idx = steps.findIndex((_, i) => !results[`${scope}:${i}`])
  const [celebrated, setCelebrated] = useState(idx === -1)
  useEffect(() => {
    if (idx === -1 && !celebrated) { party(); setCelebrated(true) }
  }, [idx, celebrated])

  if (idx === -1) return <>{children}</>
  return (
    <div className="card step" key={`${scope}:${idx}`}>
      <div className="dots">
        {steps.map((_, i) => <i key={i} className={i < idx ? 'done' : i === idx ? 'now' : ''} />)}
      </div>
      <StepView step={steps[idx]} done={(r) => record(`${scope}:${idx}`, r)} />
    </div>
  )
}
