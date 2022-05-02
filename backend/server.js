const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/connectDB');
const app = express();

const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})