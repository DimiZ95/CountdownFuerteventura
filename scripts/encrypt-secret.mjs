// Verschlüsselt den Text der letzten Überraschung mit dem Codewort aus Umschlag 3.
// Aufruf:  npm run encrypt -- "CODEWORT" "Dein Überraschungstext"
// Die Ausgabe in src/config.ts bei finale.stage3.secret einfügen.
const [code, text] = process.argv.slice(2)
if (!code || !text) {
  console.error('Aufruf: npm run encrypt -- "CODEWORT" "Text"')
  process.exit(1)
}
const norm = code.toUpperCase().replace(/\s+/g, '')
const b64 = (u) => Buffer.from(u).toString('base64')
const salt = crypto.getRandomValues(new Uint8Array(16))
const iv = crypto.getRandomValues(new Uint8Array(12))
const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(norm), 'PBKDF2', false, ['deriveKey'])
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
  material, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
)
const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text))
console.log(`secret: { s: '${b64(salt)}', i: '${b64(iv)}', c: '${b64(new Uint8Array(c))}' },`)
