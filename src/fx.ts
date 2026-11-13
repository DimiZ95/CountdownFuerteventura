import confetti from 'canvas-confetti'

const colors = ['#ffb627', '#19b5b0', '#ff6b4a', '#f4d79a', '#ffffff']
export const party = () => {
  try {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, colors })
  } catch { /* Konfetti ist optional */ }
}
export const sparkle = () => {
  try {
    confetti({ particleCount: 25, spread: 50, startVelocity: 25, origin: { y: 0.6 }, colors })
  } catch { /* optional */ }
}
