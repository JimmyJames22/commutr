const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const authRoutes = require("./routes/auth");
const { default: mongoose } = require('mongoose');

app.use(express.json());
app.use(cors());


const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true});
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB connection established");
});


app.use('/api', authRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})
