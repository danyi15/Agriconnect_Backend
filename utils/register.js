const mysql = require("mysql");
const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Konfigurasi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_agriconnect",
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    // Input data admin
    console.log("\n=== Create New Admin ===\n");

    const name = await question("Masukkan nama admin: ");
    const email = await question("Masukkan email admin: ");
    const password = await question("Masukkan password admin: ");
    const phone_number = await question(
      "Masukkan nomor telepon (optional, tekan enter untuk skip): "
    );

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Query untuk insert admin
    const sql = `
      INSERT INTO users (name, email, password_hash, role, phone_number) 
      VALUES (?, ?, ?, 'admin', ?)
    `;

    // Eksekusi query
    db.query(
      sql,
      [name, email, password_hash, phone_number || null],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.error("\nError: Email sudah terdaftar");
          } else {
            console.error("\nError:", err);
          }
          closeProgram();
          return;
        }

        console.log("\nAdmin berhasil dibuat!");
        console.log("ID Admin:", result.insertId);
        console.log("Email:", email);
        console.log("Password (sebelum hashing):", password);

        const createAnother = async () => {
          const answer = await question("\nIngin membuat admin lain? (y/n): ");
          if (answer.toLowerCase() === "y") {
            createAdmin();
          } else {
            closeProgram();
          }
        };

        createAnother();
      }
    );
  } catch (error) {
    console.error("\nError:", error);
    closeProgram();
  }
}

function closeProgram() {
  db.end();
  rl.close();
}

// Jalankan fungsi
createAdmin();
