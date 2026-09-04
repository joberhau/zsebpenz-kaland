const AUTH_KEY = 'zsebpenz-kaland-auth-v1'

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function hasPassword(): boolean {
  return localStorage.getItem(AUTH_KEY) !== null
}

export async function setPassword(password: string): Promise<void> {
  const hash = await sha256Hex(password)
  localStorage.setItem(AUTH_KEY, hash)
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return false
  const hash = await sha256Hex(password)
  return hash === stored
}

export function clearPassword(): void {
  localStorage.removeItem(AUTH_KEY)
}
