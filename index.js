require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// Route de test
app.get("/", (req, res) => {
  res.send("API User Management is running!");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

app.post("/users", (req, res) => {
  const { first_name, last_name, email, age } = req.body;

  // Validation des données d'entrée
  if (!first_name || !last_name || !email || !age) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  // Préparer l'insertion dans la base de données
  const stmt = db.prepare(
    "INSERT INTO users (first_name, last_name, email, age) VALUES (?, ?, ?, ?)"
  );

  // Exécuter la requête SQL pour insérer un nouvel utilisateur
  stmt.run(first_name, last_name, email, age, function (err) {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    // Retourner une réponse avec l'ID du nouvel utilisateur
    res
      .status(201)
      .json({ id: this.lastID, first_name, last_name, email, age });
  });
});
