import { collectibles, mapComplete, mapPieces } from '../config'
import { useGame } from '../store'

export default function Collection() {
  const have = useGame((s) => s.collectibles)
  const found = mapPieces.filter((p) => have.includes(p)).length
  const others = Object.entries(collectibles).filter(([id]) => !mapPieces.includes(id))
  return (
    <>
      <h1>Sammlung</h1>
      <h2 className="phase">Die Schatzkarte · {found}/{mapPieces.length}</h2>
      <div className="map">
        {mapPieces.map((p, i) => (
          <div key={p} className={`piece ${have.includes(p) ? 'have' : ''}`}>
            {have.includes(p) ? (i === mapPieces.length - 1 ? '❌' : '🗺️') : '?'}
            <small>{have.includes(p) ? collectibles[p].text : `Teil ${i + 1}`}</small>
          </div>
        ))}
      </div>
      {found === mapPieces.length && <div className="card"><p>{mapComplete}</p></div>}

      <h2 className="phase">Besondere Fundstücke</h2>
      <div className="items">
        {others.map(([id, c]) => (
          <div key={id} className={`item ${have.includes(id) ? 'can' : 'missing'}`}>
            <span className="item-emoji">{have.includes(id) ? c.emoji : '❔'}</span>
            <div><b>{have.includes(id) ? c.title : '???'}</b><small>{have.includes(id) ? c.text : 'Noch nicht gefunden'}</small></div>
          </div>
        ))}
      </div>
    </>
  )
}
