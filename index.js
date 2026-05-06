const express = require('express');
const bodyParser = require('body-parser');
const e = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const connectionString = "mongodb+srv://admin_jw:Hello123&@projects.5cpdcbd.mongodb.net/?appName=Projects";

MongoClient.connect(connectionString, {autoSelectFamily: false}).then(client => {
        console.log("Connected to Database");
        const db = client.db('company');
        const employeesCollection = db.collection('employees');
        const productsCollection = db.collection('products');

        app.set('view engine', 'ejs');
        app.use(bodyParser.urlencoded({ extended: true}));
        app.use(bodyParser.json());
        app.use(express.static('public'));

        app.get('/', (req, res) => {
            res.render('index.ejs');
        })

        app.get('/employees', (req, res) => {
            employeesCollection.find().toArray().then(employeesData => {
                res.render('employees.ejs', { employees: employeesData })
            })
            .catch(error => console.error(error));
        })

        app.post('/employee', (req, res) => {
            employeesCollection.insertOne(req.body).then(result => {
                res.redirect('/employees')
            })
            .catch(error => console.error(error));
        })

        app.get('/employee/:id', (req, res) => {
            employeesCollection.findOne({badgeNumber: req.params.id}).then(employeeRecord => {
                res.render('employee.ejs', {employee: employeeRecord});
            })
        })

        app.post('/editEmployee/:id', (req, res) => {
            employeesCollection.findOneAndUpdate({badgeNumber: req.params.id}, {$set: req.body}, {returnDocument: "after", returnNewDocument: true})
            .then(updatedGuy => {
                res.render('employee.ejs', {employee: updatedGuy});
            })
        })

        app.post('/deleteEmployee/:id', (req, res) => {
            employeesCollection.findOneAndDelete({badgeNumber: req.params.id}).then(result => {
                employeesCollection.find().toArray().then(
                    employeesData => {
                        res.render('employees.ejs', {employees: employeesData});
                    })
                    .catch(error => console.error(error))
            })
        })















        app.get('/products', (req, res) => {
            productsCollection.find().toArray().then(productsData => {
                res.render('products.ejs', { products: productsData })
            })
            .catch(error => console.error(error));
        })

        app.post('/product', (req, res) => {
            productsCollection.insertOne(req.body).then(result => {
                res.redirect('/products')
            })
            .catch(error => console.error(error));
        })

        app.get('/product/:id', (req, res) => {
            productsCollection.findOne({productNumber: req.params.id}).then(productsRecord => {
                res.render('product.ejs', {product: productsRecord});
            })
        })

        app.post('/editProduct/:id', (req, res) => {
            productsCollection.findOneAndUpdate({productNumber: req.params.id}, {$set: req.body}, {returnDocument: "after", returnNewDocument: true})
            .then(updatedGuy => {
                res.render('product.ejs', {product: updatedGuy});
            })
        })

        app.post('/deleteProduct/:id', (req, res) => {
            productsCollection.findOneAndDelete({productNumber: req.params.id}).then(result => {
                productsCollection.find().toArray().then(
                    productsData => {
                        res.render('products.ejs', {products: productsData});
                    })
                    .catch(error => console.error(error))
            })
        })










        app.listen(3000, function() {
            console.log(`http://localhost:3000`);
        })
})
.catch(error => console.error(error));
