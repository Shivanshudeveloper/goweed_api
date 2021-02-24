const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
// Getting Module
const Cart_Model = require('../models/Cart');
const Users_Model = require('../models/Users');


// TEST
// @GET TEST
// GET 
router.get('/test', (req, res) => {
    res.send("Working");
});

// Database CRUD Operations
// @GET Request the product lists
// GET 
router.get('/products', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Products_Model.find({})
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => console.log(err))
});

// Database CRUD Operations
// @POST Request to GET the Item
// GET 
router.get('/getitemdetails/:id', (req, res) => {
    const { id } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Products_Model.findOne({ '_id': id }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to add item in cart
// POST 
router.post('/additemtocart', (req, res) => {
    const { productId, userId, size, product } = req.body;
    Cart_Model.countDocuments({ 'productId': productId, 'userId': userId })
    .then((count) => {
        if (count === 0) {
            const newCartItem = new Cart_Model({
                productId,
                userId,
                size,
                product,
                completed: false,
                payment: false
            });
            newCartItem.save()
                .then(() => {
                    res.status(200).json('Added')
                })
                .catch(err => res.status(500).json(`Server Error is ${err}`))
        } else {
            res.status(201).json('Added')
        }
    })
    .catch(err => res.status(500).json('Server Error'))
});


// Database CRUD Operations
// @POST Request to GET the Item
// GET 
router.get('/findallthecartitems/:userId', (req, res) => {
    const { userId } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Cart_Model.find({ 'userId': userId }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @GET Request to DELETE the Compare List Cart Item
// GET 
router.get('/removeitemtocart/:documentId', (req, res) => {
    const { documentId } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Cart_Model.findOneAndDelete({ '_id': documentId })
        .then(data => {
            res.status(200).json('Removed')
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the all Reserved Properties
// GET 
router.get('/getallorders', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Cart_Model.find({ completed: false })
        .then(data => {
            const filteredArr = data.reduce((acc, current) => {
                const x = acc.find(item => item.userId === current.userId);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
            }, []);
            res.status(200).json(filteredArr);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @GET Request to get the orders of user
// GET 
router.get('/getorderdetails/:userId', (req, res) => {
    const { userId } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Cart_Model.find({ userId })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @POST Request to add Important Files
// POST
router.post('/updateprofile', (req, res) => {
    const { fullName, phoneno, address, zipcode, email } = req.body;
    Users_Model.countDocuments({ email })
    .then((count) => {
        if (count === 0) {
            const newUsers = new Users_Model({
                fullName,
                phoneno,
                address,
                zipcode,
                email
            });
            newUsers.save()
                .then(() => {
                    res.status(200).json('Users Update')
                })
                .catch(err => res.status(500).json(`Server Error is ${err}`))
        } else {
            Users_Model.findOneAndUpdate({email}, { fullName, phoneno, address, zipcode, email}, { useFindAndModify: false })
                .then(() => {
                    res.status(200).json('Users Update')
                })
                .catch(err => console.log(err))
        }
    })
    .catch(err => res.status(500).json('Server Error'))
});

// Database CRUD Operations
// @GET Request to get the orders of user
// GET 
router.get('/getuserdataaddress/:email', (req, res) => {
    const { email } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Users_Model.countDocuments({ email })
        .then((count) => {
            if (count === 0) {
                res.status(201).json(data)
            } else {
                Users_Model.find({ email })
                    .then(data => {
                        res.status(200).json(data)
                    })
                    .catch(err => res.status(400).json(`Error: ${err}`))
            }
        })
        .catch(err => res.status(500).json('Server Error'))

});

module.exports = router;