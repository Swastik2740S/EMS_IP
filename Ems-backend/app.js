require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

  
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employee'));
app.use('/api/departments', require('./routes/department'));
app.use('/api/roles', require('./routes/role'));

// Database sync
db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});
