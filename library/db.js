import mysql from "mysql2/promise";

let connection;

export const createConnection = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      });
      console.log("MySQL connection established");
    }
    return connection;
  } catch (err) {
    console.log("Connection failed:");
    throw err;
  }
};

// put this in .env
// DATABASE_HOST="localhost"
// DATABASE_USER="root"
// DATABASE_PASSWORD=""
// DATABASE_NAME="bazio"

export async function getCategories() {
  try {
    const db = await createConnection();
    const [rows] = await db.execute('SELECT id, name FROM categories ORDER BY id ASC');
    return rows;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}