const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join('/tmp', 'tasks.db')

const db = new sqlite3.Database(dbPath);

db.run(`
  CREATE TABLE IF NOT EXISTS Tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_da_tarefa TEXT UNIQUE NOT NULL,
    custo REAL NOT NULL,
    data_limite DATE NOT NULL,
    ordem INTEGER UNIQUE NOT NULL
  )
`);

module.exports = db;