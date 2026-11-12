import { useState } from 'react'
import type { View } from '../App'
import { config, kidsRewards, rewards, type Reward } from '../config'
import { party } from '../fx'
import { balance, shells, useGame } from '../store'

function Item({ r }: { r: Reward }) {
  const s = useGame()
  const bal = balance(s)
  const owned = s.vouchers.some((v) => v.rewardId === r.id)
  const hidden = r.hiddenUntil && !s.collectibles.includes(r.hiddenUntil)
  const buyable = r.where === 'zuhause' || s.shopOpen
  const wished = s.wishlist.includes(r.id)

  if (hidden)
    return (
      <div className="item secret">
        <span className="item-emoji">🔒</span>
        <div><b>Geheimregal</b><small>Öffnet sich mit einem Sammelobjekt</small></div>
      </div>
    )
  return (
    <div className={`item ${bal >= r.price ? 'can' : ''}`}>
      <span className="item-emoji">{r.emoji}</span>
      <div>
        <b>{r.title}</b>
        <small>{r.price} ☀️{bal < r.price && ` · noch ${r.price - bal}`}{r.multi && ' · mehrfach möglich'}</small>
      </div>
      {owned && !r.multi ? (
        <span className="tag">✓ deins</span>
      ) : buyable ? (
        <button className="btn small" disabled={bal < r.price} onClick={() => s.buy(r.id) && party()}>Holen</button>
      ) : (
        <button className={`heart ${wished ? 'on' : ''}`} aria-label="Auf die Wunschliste" onClick={() => s.toggleWish(r.id)}>
          {wished ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  )
}

export function Shop() {
  const s = useGame()
  const sh = shells(s)
  return (
    <>
      <h1>Urlaubsshop</h1>
      <div className="card wallet"><span>Dein Guthaben</span><b>{balance(s)} ☀️</b></div>

      <h2 className="phase">Sofort zu Hause</h2>
      <div className="items">{rewards.filter((r) => r.where === 'zuhause').map((r) => <Item key={r.id} r={r} />)}</div>

      <h2 className="phase">Im Urlaub</h2>
      {!s.shopOpen && (
        <div className="majo"><span className="majo-face">{config.mascot.emoji}</span>
          <p>Das ist noch das Schaufenster. Die Kasse öffnet am letzten Abend – bis dahin: Herzchen verteilen und sparen!</p>
        </div>
      )}
      <div className="items">{rewards.filter((r) => r.where === 'urlaub').map((r) => <Item key={r.id} r={r} />)}</div>

      <h2 className="phase">Muschel-Schätze von {config.family.kids}</h2>
      <div className="items">
        {kidsRewards.map((k) => (
          <div key={k.at} className={`item kid ${sh >= k.at ? 'can' : ''}`}>
            <span className="item-emoji">{sh >= k.at ? k.emoji : '🎁'}</span>
            <div>
              <b>{k.title}</b>
              <div className="bar"><i style={{ width: `${Math.min(100, (sh / k.at) * 100)}%` }} /></div>
            </div>
            <span className="tag">{sh >= k.at ? '✓' : `${sh}/${k.at} 🐚`}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export function Vouchers({ go }: { go: (v: View) => void }) {
  const s = useGame()
  const [confirm, setConfirm] = useState<string | null>(null)
  const fmt = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' })
  return (
    <>
      <h1>Meine Gutscheine</h1>
      {s.vouchers.length === 0 && (
        <div className="card empty">
          <div className="bigemoji">🎟️</div>
          <p>Noch keine Gutscheine. Im Shop warten die ersten Belohnungen.</p>
          <button className="btn" onClick={() => go({ name: 'shop' })}>Zum Shop</button>
        </div>
      )}
      {s.vouchers.map((v) => {
        const r = rewards.find((x) => x.id === v.rewardId)!
        return (
          <div key={v.id} className={`voucher ${v.redeemedAt ? 'used' : ''}`}>
            <span className="item-emoji">{r.emoji}</span>
            <div>
              <small>Gutschein · {r.where === 'urlaub' ? 'Fuerteventura' : 'Zuhause'}</small>
              <b>{r.title}</b>
              <small>{v.redeemedAt ? `Eingelöst am ${fmt.format(new Date(v.redeemedAt))}` : `Erspielt am ${fmt.format(new Date(v.boughtAt))}`}</small>
            </div>
            {v.redeemedAt ? <span className="stamp">Eingelöst</span> : <button className="btn small" onClick={() => setConfirm(v.id)}>Einlösen</button>}
          </div>
        )
      })}
      {confirm && (
        <div className="overlay" onClick={() => setConfirm(null)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <div className="bigemoji">🤝</div>
            <h2>Jetzt einlösen?</h2>
            <p>Gib das Handy kurz an {config.family.papa} – er bestätigt.</p>
            <button className="btn" onClick={() => { s.redeemVoucher(confirm); setConfirm(null); party() }}>{config.family.papa} bestätigt ✓</button>
            <button className="link" onClick={() => setConfirm(null)}>Doch noch nicht</button>
          </div>
        </div>
      )}
    </>
  )
}
