require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express")
const app = express()
const mongoUri = process.env.MONGO_URI
const port = process.env.PORT;

const staticData = [

  { id: 1, name: 'Item 1' },

];
app.get('/api/items', (req, res) => {
  res.json(staticData);
});



mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log('DB is connected');
    });
  })
  .catch((error) => {
    console.log(error);
  });

