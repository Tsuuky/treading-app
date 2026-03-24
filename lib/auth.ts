import bcrypt from 'bcryptjs';

const user = { id: 'u1', username: 'demo', passwordHash: bcrypt.hashSync('demo1234', 10) };

export async function verifyUser(username: string, password: string) {
  if (username !== user.username) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? { id: user.id, username: user.username } : null;
}

export function parseAuthCookie(cookie?: string) {
  if (!cookie) return null;
  const token = cookie.split(';').map((p) => p.trim()).find((v) => v.startsWith('pt_session='));
  if (!token) return null;
  const value = token.split('=')[1];
  return value === 'mock-u1' ? { id: 'u1', username: 'demo' } : null;
}
