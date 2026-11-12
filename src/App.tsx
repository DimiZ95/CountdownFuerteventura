import { useEffect, useState } from 'react'
import { config } from './config'
import { now, useGame } from './store'
import Home from './views/Home'
import DoorView from './views/Door'
import { Shop, Vouchers } from './views/Shop'
import Collection from './views/Collection'
import Finale from './views/Finale'
import { DemoPanel, PrintSheet } from './views/Demo'

export type View =
  | { name: 'home' | 'shop' | 'vouchers' | 'collection' | 'finale' | 'print' }
  | { name: 'door'; id: number }

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' })
  const s = useGame()

  useEffect(() => {
    const demo = new URLSearchParams(location.search).get('demo')
    if (demo === '1') s.setDemo({ demo: true })
    if (demo === '0') s.setDemo({ demo: false, demoDate: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Geschweifte Klammern sind wichtig: neuere Browser geben bei scrollTo ein Promise zurück
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  const finaleVisible = s.demo || s.stages.length > 0 || now(s) >= new Date(`${config.finaleFrom}T00:00:00`)
  const tabs: { name: View['name']; icon: string; label: string }[] = [
    { name: 'home', icon: '🏝️', label: 'Start' },
    { name: 'collection', icon: '🗺️', label: 'Sammlung' },
    { name: 'shop', icon: '🛍️', label: 'Shop' },
    { name: 'vouchers', icon: '🎟️', label: 'Gutscheine' },
    ...(finaleVisible ? [{ name: 'finale' as const, icon: '✈️', label: 'Finale' }] : []),
  ]

  if (view.name === 'print') return <PrintSheet back={() => setView({ name: 'home' })} />

  return (
    <div className="app">
      <main>
        {view.name === 'home' && <Home go={setView} />}
        {view.name === 'door' && <DoorView id={view.id} go={setView} />}
        {view.name === 'shop' && <Shop />}
        {view.name === 'vouchers' && <Vouchers go={setView} />}
        {view.name === 'collection' && <Collection />}
        {view.name === 'finale' && <Finale go={setView} />}
      </main>
      <nav className="tabs">
        {tabs.map((t) => (
          <button key={t.name} className={view.name === t.name ? 'on' : ''} onClick={() => setView({ name: t.name } as View)}>
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
      {s.demo && <DemoPanel go={setView} />}
    </div>
  )
}
