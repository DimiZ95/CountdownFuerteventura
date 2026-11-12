import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { codes, config, doors, rewards, type Code } from './config'

export type Result = { points: number; shells: number; data?: string }
export type Voucher = { id: string; rewardId: string; boughtAt: string; redeemedAt?: string }

type State = {
  results: Record<string, Result> // Schlüssel: "<bereich>:<schritt>", z. B. "d3:1" oder "d3j:0"
  opened: number[]
  codes: string[]
  bonus: { points: number; shells: number }
  collectibles: string[]
  wishlist: string[]
  vouchers: Voucher[]
  shopOpen: boolean
  stages: number[]
  secret: string | null
  demo: boolean
  demoDate: string | null
}
type Actions = {
  record: (key: string, r: Result) => void
  openDoor: (id: number) => void
  grant: (id: string) => void
  redeemCode: (c: Code) => void
  toggleWish: (id: string) => void
  buy: (id: string) => boolean
  redeemVoucher: (id: string) => void
  openShop: () => void
  unlockStage: (n: number, secret?: string) => void
  setDemo: (p: Partial<State>) => void
  addBonus: (points: number, shells: number) => void
  reset: () => void
}

const initial: State = {
  results: {}, opened: [], codes: [], bonus: { points: 0, shells: 0 }, collectibles: [],
  wishlist: [], vouchers: [], shopOpen: false, stages: [], secret: null, demo: false, demoDate: null,
}

export const useGame = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      record: (key, r) => set((s) => (s.results[key] ? s : { results: { ...s.results, [key]: r } })),
      openDoor: (id) => set((s) => (s.opened.includes(id) ? s : { opened: [...s.opened, id] })),
      grant: (id) => set((s) => (s.collectibles.includes(id) ? s : { collectibles: [...s.collectibles, id] })),
      redeemCode: (c) =>
        set((s) => {
          if (s.codes.includes(c.code)) return s
          return {
            codes: [...s.codes, c.code],
            bonus: { points: s.bonus.points + (c.points ?? 0), shells: s.bonus.shells + (c.shells ?? 0) },
            collectibles: c.collectible && !s.collectibles.includes(c.collectible) ? [...s.collectibles, c.collectible] : s.collectibles,
            stages: c.stage && !s.stages.includes(c.stage) ? [...s.stages, c.stage] : s.stages,
          }
        }),
      toggleWish: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
      buy: (id) => {
        const r = rewards.find((x) => x.id === id)
        if (!r || balance(get()) < r.price) return false
        set((s) => ({
          vouchers: [...s.vouchers, { id: `${id}-${Date.now()}`, rewardId: id, boughtAt: new Date().toISOString() }],
          wishlist: s.wishlist.filter((w) => w !== id),
        }))
        return true
      },
      redeemVoucher: (id) =>
        set((s) => ({ vouchers: s.vouchers.map((v) => (v.id === id ? { ...v, redeemedAt: new Date().toISOString() } : v)) })),
      openShop: () => set({ shopOpen: true }),
      unlockStage: (n, secret) =>
        set((s) => ({ stages: s.stages.includes(n) ? s.stages : [...s.stages, n], secret: secret ?? s.secret })),
      setDemo: (p) => set(p),
      addBonus: (points, shells) => set((s) => ({ bonus: { points: s.bonus.points + points, shells: s.bonus.shells + shells } })),
      reset: () => set((s) => ({ ...initial, demo: s.demo })),
    }),
    { name: 'fuerte-abenteuer-v1' },
  ),
)

// ---- Abgeleitete Werte -----------------------------------------------------
const sum = (s: State, f: 'points' | 'shells') => Object.values(s.results).reduce((a, r) => a + r[f], 0) + s.bonus[f]
export const earned = (s: State) => sum(s, 'points')
export const shells = (s: State) => sum(s, 'shells')
export const spent = (s: State) => s.vouchers.reduce((a, v) => a + (rewards.find((r) => r.id === v.rewardId)?.price ?? 0), 0)
export const balance = (s: State) => earned(s) - spent(s)

export const now = (s: Pick<State, 'demoDate'>) => (s.demoDate ? new Date(s.demoDate) : new Date())
export const doorTime = (date: string) => new Date(`${date}T${String(config.unlockHour).padStart(2, '0')}:00:00`)
export const isUnlocked = (date: string, n: Date) => n >= doorTime(date)

export const scopeDone = (s: State, scope: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${scope}:${i}`).every((k) => s.results[k])
export const doorDone = (s: State, id: number) => {
  const d = doors.find((x) => x.id === id)!
  return scopeDone(s, `d${id}`, d.steps.length)
}
export const juniorDone = (s: State, id: number) => {
  const d = doors.find((x) => x.id === id)!
  return !d.junior || scopeDone(s, `d${id}j`, d.junior.length)
}
export const norm = (t: string) => t.toUpperCase().replace(/\s+/g, '')
export const findCode = (input: string) => codes.find((c) => norm(c.code) === norm(input))
