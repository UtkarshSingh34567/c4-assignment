const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const routes = require('./extension/router');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
