/** Password-protected export using Web Crypto (AES-GCM + PBKDF2). */

function b64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromB64(str) {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function cryptoSupported() {
  return !!(globalThis.crypto?.subtle);
}

export async function encryptJson(json, password) {
  if (!password || password.length < 4) throw new Error('Password must be at least 4 characters');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(json)
  );
  return JSON.stringify({
    financerEncrypted: true,
    v: 1,
    salt: b64(salt),
    iv: b64(iv),
    data: b64(cipher),
  });
}

export async function decryptJson(payload, password) {
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!parsed?.financerEncrypted) throw new Error('Not an encrypted Financer backup');
  const key = await deriveKey(password, fromB64(parsed.salt));
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(parsed.iv) },
    key,
    fromB64(parsed.data)
  );
  return new TextDecoder().decode(plain);
}
