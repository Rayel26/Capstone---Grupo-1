const functions = require("firebase-functions");
const express = require("express");

// Importa tu aplicación Flask (aquí se asume que está en un archivo separado)
const app = require("./app"); // Asegúrate de que tu archivo Flask sea `app.py` y esté correctamente exportado

// Configura el servidor Express
const server = express();
server.use(express.json()); // Permitir el uso de JSON
server.use(express.urlencoded({ extended: true })); // Para parsear datos url-encoded

// Define las rutas
server.use("/", app); // Usa tu aplicación Flask

// Exporta la función
exports.yourFlaskFunction = functions.https.onRequest(server);

import './firebase-config.js';
