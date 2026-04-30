'use server';

import bcrypt from 'bcrypt';
import { createConnection } from './db';
import { createSession, deleteSession } from './auth';
import { redirect } from 'next/navigation';

export async function register(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const full_name = formData.get('full_name');
  const phone = formData.get('phone') || null;
  const location = formData.get('location') || null;

  if (!email || !password || !full_name) {
    return { error: 'Email, password, and full name are required.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let db;
  try {
    db = await createConnection();
  } catch (e) {
    return { error: 'Failed to connect to database.' };
  }

  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return { error: 'Email is already in use.' };
    }

    await db.execute(
      'INSERT INTO users (email, password_hash, full_name, phone, location) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, phone, location]
    );

  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register account.' };
  }
  
  // Redirect to login after successful registration
  redirect('/login');
}

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  let db;
  try {
    db = await createConnection();
  } catch (e) {
    return { error: 'Failed to connect to database.' };
  }
  
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordsMatch) {
      return { error: 'Invalid email or password.' };
    }

    await createSession(user.id);
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong.' };
  }

  redirect('/profile');
}

export async function logout() {
  await deleteSession();
  redirect('/');
}
