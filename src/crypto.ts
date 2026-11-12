// Die letzte Überraschung liegt nur verschlüsselt in der App.
// Ohne das Codewort aus Umschlag 3 kann sie niemand lesen – auch nicht im Quelltext.
export type Secret = { s: string; i: string; c: string }
const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

export async function decrypt(secret: Secret, code: string): Promise<string | null> {
  if (!secret.c) return null
  try {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey'])
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64(secret.s), iterations: 150000, hash: 'SHA-256' },
      material, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
    )
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(secret.i) }, key, b64(secret.c))
    return new TextDecoder().decode(plain)
  } catch {
    return null
  }
}
