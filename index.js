require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// Route principale pour afficher index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connexion à la base de données SQLite
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données", err);
  } else {
    console.log("Base de données connectée !");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, age INTEGER NOT NULL)"
    );
  }
});

// Route pour ajouter un utilisateur
app.post("/users", (req, res) => {
  const { first_name, last_name, email, age } = req.body;

  if (!first_name || !last_name || !email || !age) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const stmt = db.prepare(
    "INSERT INTO users (first_name, last_name, email, age) VALUES (?, ?, ?, ?)"
  );

  stmt.run(first_name, last_name, email, age, function (err) {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    res
      .status(201)
      .json({ id: this.lastID, first_name, last_name, email, age });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
