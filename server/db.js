import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Create a connection pool using the environment variables
const pool = mysql.createPool({
  host: 'db',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT); 
console.log(process.env.DB_USERNAME); 
console.log(process.env.DB_PASSWORD); 
console.log(process.env.DB_DATABASE);

async function saveMessage(message) {
    const { text, recipientId, senderId } = message;
    const [rows] = await pool.query('INSERT INTO messages SET ?', {
      message: text,
      recipient_id: recipientId,
      sender_id: senderId
    });
    return rows;
  }

export { saveMessage };