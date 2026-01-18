import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                // Create a default admin user if not exists
                const adminUser = 'admin';
                const adminPass = 'admin123';
                db.get(`SELECT * FROM users WHERE username = ?`, [adminUser], async (err, row) => {
                    if (!row) {
                        const hashedPassword = await bcrypt.hash(adminPass, 10);
                        db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
                            [adminUser, hashedPassword, 'admin']);
                        console.log('Default admin created: admin / admin123');
                    }
                });
            }
        });
    }
});

export default db;
