const db = require('../database/database');

const taskController = {
  getAllTasks: (req, res) => {
    db.all('SELECT * FROM Tarefas ORDER BY ordem', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
      console.log(rows, 'colunas')
    });
  },

  createTask: (req, res) => {
    const { nome_da_tarefa, custo, data_limite } = req.body;
    
    db.get('SELECT MAX(ordem) as maxOrdem FROM Tarefas', [], (err, row) => {
      const nextOrdem = (row.maxOrdem || 0) + 1;
      
      db.run(
        'INSERT INTO Tarefas (nome_da_tarefa, custo, data_limite, ordem) VALUES (?, ?, ?, ?)',
        [nome_da_tarefa, custo, data_limite, nextOrdem],
        function(err) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID });
        }
      );
    });
  },

  updateTask: (req, res) => {
    const { nome_da_tarefa, custo, data_limite } = req.body;
    
    db.run(
      'UPDATE Tarefas SET nome_da_tarefa = ?, custo = ?, data_limite = ? WHERE id = ?',
      [nome_da_tarefa, custo, data_limite, req.params.id],
      function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ changes: this.changes });
      }
    );
  },

  deleteTask: (req, res) => {
    db.run('DELETE FROM Tarefas WHERE id = ?', [req.params.id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ deleted: this.changes > 0 });
    });
  },

   reorderTask: (req, res) => {
    const { newOrdem, oldOrdem } = req.body;
    const taskId = req.params.id;
    
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
  
      try {
        // Primeiro, movemos o item sendo arrastado para uma ordem temporária negativa
        // (assumindo que não teremos ordens negativas no uso normal)
        db.run(
          'UPDATE Tarefas SET ordem = -1 WHERE id = ?',
          [taskId]
        );
  
        if (newOrdem < oldOrdem) {
          // Movendo para cima
          db.run(
            'UPDATE Tarefas SET ordem = ordem + 1 WHERE ordem >= ? AND ordem < ?',
            [newOrdem, oldOrdem]
          );
        } else {
          // Movendo para baixo
          db.run(
            'UPDATE Tarefas SET ordem = ordem - 1 WHERE ordem > ? AND ordem <= ?',
            [oldOrdem, newOrdem]
          );
        }
  
        // Finalmente, colocamos o item na sua posição final
        db.run(
          'UPDATE Tarefas SET ordem = ? WHERE id = ?',
          [newOrdem, taskId],
          function(err) {
            if (err) {
              console.error('Error in final update:', err);
              db.run('ROLLBACK');
              res.status(400).json({ error: err.message });
              return;
            }
            
            db.run('COMMIT');
            res.json({ success: true });
          }
        );
      } catch (err) {
        console.error('Error in transaction:', err);
        db.run('ROLLBACK');
        res.status(400).json({ error: err.message });
      }
    });
  }
}

module.exports = taskController;