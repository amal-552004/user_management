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
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)"
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
  const { name, email, password } = req.body;

  // Validation des données d'entrée
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  // Préparer l'insertion dans la base de données
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  );

  // Exécuter la requête SQL pour insérer un nouvel utilisateur
  stmt.run(name, email, password, function (err) {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur", error: err });
    }
    // Retourner une réponse avec l'ID du nouvel utilisateur
    res.status(201).json({ id: this.lastID, name, email });
  });
});
