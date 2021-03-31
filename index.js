const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
app.use(cors());
app.use(express.json());

// app.use(express.urlencoded({ extended: false }))
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acxxo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello I am working with my e-commerce project');
})

client.connect(err => {
    
    const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

    //handling add product from admin panel functionality
    app.post('/addProduct', (req, res) => {
        const productDetails = req.body;
        productsCollection.insertOne(productDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //handling load all products from database functionality
    app.get('/allProducts', (req, res) => {
        productsCollection.find({})
            .toArray((err, products) => {
                res.send(products)
            })
    })

    //handling delete product from admin page functionality
    app.delete('/deleteProduct', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        productsCollection.deleteOne({ _id: ObjectID(req.body.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    //handling checkout item functionality
    app.get('/checkout/:id', (req, res) => {
        const productId = { id: req.params.id };
        productsCollection.find({ _id: ObjectID(productId.id) })
            .toArray((err, product) => {
                res.send(product[0])
            })
    })

    //handling order item functionality
    app.post('/addOrder', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //loading order information sorting by email
    app.get('/orderHistory', (req, res) => {
        orderCollection.find({email: req.query.email})
            .toArray((err, products) => {
                res.send(products)
            })
    })

});


app.listen(process.env.PORT || 8080);