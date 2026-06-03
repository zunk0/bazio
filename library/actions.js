'use server';

import bcrypt from 'bcrypt';
import { createConnection } from './db';
import { createSession, deleteSession } from './auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function saveUploadedImage(image) {
  if (!image || image.size === 0) return null;
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(image.name) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
  await writeFile(uploadPath, buffer);
  return `/uploads/${filename}`;
}

export async function incrementViews(id) {
  const cookieStore = await cookies();
  const viewedKey = `viewed_${id}`;
  if (cookieStore.get(viewedKey)) {
    return;
  }

  let db;
  try {
    db = await createConnection();
    await db.execute('UPDATE listings SET views = views + 1 WHERE id = ?', [id]);
    cookieStore.set(viewedKey, 'true', {
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      httpOnly: true,
    });
  } catch (error) {
    console.error('Failed to increment views:', error);
  }
}

export async function register(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const confirm_password = formData.get('confirm_password');
  const full_name = formData.get('full_name');
  const phone = formData.get('phone');
  const location = formData.get('location');

  if (!email) return { error: 'Email address is required.' };
  if (!full_name) return { error: 'Full name is required.' };
  if (!phone) return { error: 'Phone number is required.' };
  if (!password) return { error: 'Password is required.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters long.' };
  if (password !== confirm_password) return { error: 'Passwords do not match.' };
  if (!location) return { error: 'Location is required.' };

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
  const callbackUrl = formData.get('callbackUrl') || '/profile';

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

  redirect(callbackUrl);
}

export async function logout() {
  await deleteSession();
  redirect('/');
}

export async function createListing(prevState, formData) {
  const { getSession } = await import('./auth');
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const title = formData.get('title');
  const content = formData.get('content') || null;
  const price = formData.get('price');
  const category_id = formData.get('category_id') || null;
  const location = formData.get('location') || null;
  const image = formData.get('image');

  if (!title || !price) {
    return { error: 'Title and price are required.' };
  }

  let db;
  try {
    db = await createConnection();
  } catch (e) {
    return { error: 'Failed to connect to database.' };
  }

  try {
    // Insert listing
    const [result] = await db.execute(
      'INSERT INTO listings (user_id, category_id, title, content, price, location) VALUES (?, ?, ?, ?, ?, ?)',
      [session.userId, category_id, title, content, price, location]
    );

    const listingId = result.insertId;

    // Handle image upload
    const imageUrl = await saveUploadedImage(image);
    if (imageUrl) {
      await db.execute(
        'INSERT INTO listing_images (listing_id, url) VALUES (?, ?)',
        [listingId, imageUrl]
      );
    }
  } catch (error) {
    console.error('Create listing error:', error);
    return { error: 'Failed to create listing.' };
  }

  redirect('/mylistings');
}

export async function updateListing(prevState, formData) {
  const { getSession } = await import('./auth');
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const id = formData.get('id');
  const title = formData.get('title');
  const content = formData.get('content') || null;
  const price = formData.get('price');
  const category_id = formData.get('category_id') || null;
  const location = formData.get('location') || null;
  const image = formData.get('image');

  if (!id || !title || !price) {
    return { error: 'ID, title, and price are required.' };
  }

  let db;
  try {
    db = await createConnection();
  } catch (e) {
    return { error: 'Failed to connect to database.' };
  }

  try {
    // Verify ownership
    const [listings] = await db.execute('SELECT * FROM listings WHERE id = ? AND user_id = ?', [id, session.userId]);
    if (listings.length === 0) {
      return { error: 'Unauthorized or listing not found.' };
    }

    // Update listing
    await db.execute(
      'UPDATE listings SET category_id = ?, title = ?, content = ?, price = ?, location = ? WHERE id = ?',
      [category_id, title, content, price, location, id]
    );

    // Handle optional image upload
    const imageUrl = await saveUploadedImage(image);
    if (imageUrl) {
      // Check if image exists
      const [images] = await db.execute('SELECT * FROM listing_images WHERE listing_id = ?', [id]);
      if (images.length > 0) {
        await db.execute('UPDATE listing_images SET url = ? WHERE listing_id = ?', [imageUrl, id]);
      } else {
        await db.execute('INSERT INTO listing_images (listing_id, url) VALUES (?, ?)', [id, imageUrl]);
      }
    }
  } catch (error) {
    console.error('Update listing error:', error);
    return { error: 'Failed to update listing.' };
  }

  redirect('/mylistings');
}

export async function deleteListing(id) {
  const { getSession } = await import('./auth');
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  let db;
  try {
    db = await createConnection();
  } catch (e) {
    throw new Error('Failed to connect to database.');
  }

  try {
    // Verify ownership
    const [listings] = await db.execute('SELECT * FROM listings WHERE id = ? AND user_id = ?', [id, session.userId]);
    if (listings.length === 0) {
      throw new Error('Unauthorized or listing not found.');
    }

    await db.execute('DELETE FROM listings WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete listing error:', error);
    throw error;
  }

  redirect('/mylistings');
}

export async function toggleListingStatus(id) {
  const { getSession } = await import('./auth');
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  let db;
  try {
    db = await createConnection();
  } catch (e) {
    throw new Error('Failed to connect to database.');
  }

  try {
    // Verify ownership
    const [listings] = await db.execute('SELECT * FROM listings WHERE id = ? AND user_id = ?', [id, session.userId]);
    if (listings.length === 0) {
      throw new Error('Unauthorized or listing not found.');
    }

    const currentStatus = listings[0].status;
    const newStatus = currentStatus ? 0 : 1;

    await db.execute('UPDATE listings SET status = ? WHERE id = ?', [newStatus, id]);
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/mylistings/edit/${id}`);
    revalidatePath(`/listing/${id}`);
    revalidatePath(`/mylistings`);
  } catch (error) {
    console.error('Toggle listing status error:', error);
    throw error;
  }
}
