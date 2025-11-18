import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE_NAME = 'ghl_session';

export async function setSession(data) {
  console.log('setSession - Data to save:', data);
  
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  console.log('setSession - Token created:', token ? 'yes' : 'no');

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  
  console.log('setSession - Cookie set with name:', COOKIE_NAME);
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  console.log('getSession - Token from cookie:', token ? 'present' : 'missing');

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log('getSession - Payload:', payload);
    return payload;
  } catch (error) {
    console.log('getSession - Error verifying token:', error.message);
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
