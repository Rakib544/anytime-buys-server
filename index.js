const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
app.use(express.json());
app.use(cors());
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acxxo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello I am working with my e-commerce project');
})




client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  
  app.post('/addProduct', (req, res) => {
      const productDetails = req.body;
      productsCollection.insertOne(productDetails)
      .then(result => {
          console.log(result)
          res.send(result.insertedCount > 0)
      })
  })
});


app.listen(process.env.PORT || 8080);