// server.js
const app = require('./app');
const sequelize = require('./config/database');

sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
