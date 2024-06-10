import { createPool } from "mysql";

export const db = createPool({
  connectionLimit: 5,
  host: "b0buqs1mabxcs7bsz1vt-mysql.services.clever-cloud.com",
  user: "u54psj89oo1wjghi",
  password: "2wSBQzF6T1IuoUjJ8QMU",
  database: "b0buqs1mabxcs7bsz1vt",
});

db.on("error", (err) => {
  console.log("Database error:", err);
});

db.on("connection", (connection) => {
  console.log("New database connection established");

  connection.on('error', (err) => {
    console.error('Database connection error:', err);
  });

  connection.on('end', () => {
    console.log('Database connection closed');
  });
});

const gracefulShutdown = () => {
  db.end((err) => {
    if (err) {
      console.error('Error occurred while closing database pool:', err);
      process.exit(1);
    }
    console.log('Database pool closed gracefully');
    process.exit();
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('exit', () => {
  db.end((err) => {
    if (err) {
      console.error('Error occurred while closing database pool:', err);
    } else {
      console.log('Database pool closed gracefully');
    }
  });
});
