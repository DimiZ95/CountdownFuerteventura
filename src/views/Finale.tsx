import { useEffect } from 'react'
import type { View } from '../App'
import { config, finale, kidsRewards, rewards } from '../config'
import { Runner } from '../steps/Steps'
import { earned, scopeDone, shells, useGame } from '../store'
import { CodeBox } from './Home'

function Locked({ n, title, where, hint }: { n: number; title: string; where: string; hint: string }) {
  return (
    <div className="card stage locked">
      <span className="stage-n">🔒</span>
      <div><small>Etappe {n} · {where}</small><b>{title}</b><p>{hint}</p></div>
    </div>
  )
}

export default function Finale({ go }: { go: (v: View) => void }) {
  const s = useGame()
  const s1 = s.stages.includes(1), s2 = s.stages.includes(2), s3 = s.stages.includes(3)
  const f1done = scopeDone(s, 'f1', finale.stage1.steps.length)
  useEffect(() => {
    if (s1 && f1done && !s.shopOpen) s.openShop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s1, f1done])
  const open = s.vouchers.filter((v) => !v.redeemedAt)
  const hasKey = s.collectibles.includes('schluessel')

  return (
    <>
      <h1>Das Finale</h1>
      <p className="lead">Drei Umschläge, drei Etappen. In jedem Umschlag steckt ein Codewort.</p>
      {!(s1 && s2 && s3) && <CodeBox />}

      {/* Etappe 1 */}
      {!s1 ? <Locked n={1} title={finale.stage1.title} where={finale.stage1.where} hint="Codewort aus Umschlag 1 eingeben." /> : (
        <section>
          <h2 className="phase">Etappe 1 · {finale.stage1.title}</h2>
          <Runner scope="f1" steps={finale.stage1.steps}>
            <div className="card summary">
              <div className="bigemoji">🛍️</div>
              <h2>{earned(s)} ☀️ erspielt!</h2>
              <p>{finale.stage1.done}</p>
              <button className="btn" onClick={() => go({ name: 'shop' })}>Zum Urlaubsshop</button>
            </div>
          </Runner>
        </section>
      )}

      {/* Etappe 2 */}
      {!s2 ? <Locked n={2} title={finale.stage2.title} where={finale.stage2.where} hint="Codewort aus Umschlag 2 eingeben." /> : (
        <section>
          <h2 className="phase">Etappe 2 · {finale.stage2.title}</h2>
          <div className="boarding">
            <header><span>✈️ BOARDING PASS</span><b>FUE</b></header>
            <p>{finale.stage2.text}</p>
            <ul>
              {open.length === 0 && <li>Noch keine Gutscheine – schnell in den Shop!</li>}
              {open.map((v) => { const r = rewards.find((x) => x.id === v.rewardId)!; return <li key={v.id}>{r.emoji} {r.title}</li> })}
              {kidsRewards.filter((k) => shells(s) >= k.at).map((k) => <li key={k.at}>{k.emoji} {config.family.kids}: {k.title}</li>)}
            </ul>
            <footer>Passagiere: 4 · Sitzplatz: Sonnenseite</footer>
          </div>
        </section>
      )}

      {/* Etappe 3 */}
      {!s3 ? (
        <Locked n={3} title={finale.stage3.title} where={finale.stage3.where}
          hint={hasKey ? 'Du hast den goldenen Schlüssel 🗝️. Jetzt fehlt nur das Codewort aus Umschlag 3.' : 'Hier brauchst du den goldenen Schlüssel und das Codewort aus Umschlag 3.'} />
      ) : (
        <section>
          <h2 className="phase">Etappe 3 · {finale.stage3.title}</h2>
          <div className="card secret-reveal">
            <div className="bigemoji">🗝️</div>
            <p>{s.secret}</p>
          </div>
        </section>
      )}
    </>
  )
}
