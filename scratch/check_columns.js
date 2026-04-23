const mysql = require('mysql2/promise');

async function checkColumns() {
  try {
    // Attempting to connect using common env names often used in Next.js
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'bazio',
    });
    
    const [rows] = await connection.execute('DESCRIBE listings');
    console.log('LISTINGS_COLUMNS:', rows.map(r => r.Field).join(', '));
    
    const [catRows] = await connection.execute('DESCRIBE categories');
    console.log('CATEGORIES_COLUMNS:', catRows.map(r => r.Field).join(', '));
    
    process.exit(0);
  } catch (err) {
    console.error('DATABASE_ERROR:', err.message);
    process.exit(1);
  }
}

checkColumns();
