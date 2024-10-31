const express = require('express');
const cors = require('cors');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 