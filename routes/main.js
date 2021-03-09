const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
// Getting Module
const Cart_Model = require('../models/Cart');
const Users_Model = require('../models/Users');
const Flower_Model = require('../models/Flower');
const AddPreRolls_Model = require('../models/AddPreRolls');
const Vapes_Model = require('../models/Vapes');
const Extracts_Model = require('../models/Extracts');
const Edibles_Model = require('../models/Edibles');
const Tropicals_Model = require('../models/Tropicals');
const Favorite_Model = require('../models/Favorites');
const SuccessfullPayment_Model = require('../models/SuccessfullPayment');


const stripe = require('stripe')('sk_test_51IQmDSLbp71n4XnI9AJa2u03XqqNh2YTPlLtiAuiOOK6lrnpj8V1RnSNbxesLdCkChISlZXMJ89gIyr8WOBwCAlh00BCFkGRAW')

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
    Cart_Model.find({ 'userId': userId, 'payment': false }).sort({date: -1})
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


// Database CRUD Operations
// @POST Request to add Flower
// POST 
router.post('/addflower', (req, res) => {
    const { name, company, thc, cbd, category, photoDownloadUrl1, price, size } = req.body;
    const newItem = new Flower_Model({
        name,
        company,
        thc,
        cbd,
        category,
        photoDownloadUrl1,
        price,
        size
    });
    newItem.save()
        .then(() => {
            res.status(200).json('Item Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});

// Database CRUD Operations
// @POST Request to add Flower
// POST 
router.post('/addprerolls', (req, res) => {
    const { name, company, thc, cbd, category, photoDownloadUrl1, price, size } = req.body;
    const newItem = new AddPreRolls_Model({
        name,
        company,
        thc,
        cbd,
        category,
        photoDownloadUrl1,
        price,
        size
    });
    newItem.save()
        .then(() => {
            res.status(200).json('Item Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});

// Database CRUD Operations
// @POST Request to add Flower
// POST 
router.post('/addvapes', (req, res) => {
    const { name, company, thc, cbd, category, subcategory, photoDownloadUrl1, price, size } = req.body;
    const newItem = new Vapes_Model({
        name,
        company,
        thc,
        cbd,
        category,
        subcategory,
        photoDownloadUrl1,
        price,
        size
    });
    newItem.save()
        .then(() => {
            res.status(200).json('Item Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});

// Database CRUD Operations
// @POST Request to add Flower
// POST 
router.post('/addextracts', (req, res) => {
    const { name, company, thc, cbd, category, subcategory, photoDownloadUrl1, price, size } = req.body;
    const newItem = new Extracts_Model({
        name,
        company,
        thc,
        cbd,
        category,
        subcategory,
        photoDownloadUrl1,
        price,
        size
    });
    newItem.save()
        .then(() => {
            res.status(200).json('Item Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});

// Database CRUD Operations
// @POST Request to add Flower
// POST 
router.post('/addedibles', (req, res) => {
    const { name, company, thc, cbd, category, subcategory, photoDownloadUrl1, price, size } = req.body;
    const newItem = new Edibles_Model({
        name,
        company,
        thc,
        cbd,
        category,
        subcategory,
        photoDownloadUrl1,
        price,
        size
    });
    newItem.save()
        .then(() => {
            res.status(200).json('Item Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});

// Database CRUD Operations
// @POST Request to add Flower
// POST 
router.post('/addtropicals', (req, res) => {
    const { name, company, thc, cbd, category, subcategory, photoDownloadUrl1, price, size } = req.body;
    const newItem = new Tropicals_Model({
        name,
        company,
        thc,
        cbd,
        category,
        subcategory,
        photoDownloadUrl1,
        price,
        size
    });
    newItem.save()
        .then(() => {
            res.status(200).json('Item Added')
        })
        .catch(err => res.status(500).json(`Server Error is ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/getflowers', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Flower_Model.find({}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/getprerolls', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    AddPreRolls_Model.find({}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/vapes', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Vapes_Model.find({}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/extracts', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Extracts_Model.find({}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/edibles', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Edibles_Model.find({}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});

// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/tropicals', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Tropicals_Model.find({}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/getflowersfiltersize/:s', (req, res) => {
    let { s } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Flower_Model.find({size: {$elemMatch: {'size': s}}}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/getflowersfiltercategory/:c', (req, res) => {
    let { c } = req.params;
    res.setHeader('Content-Type', 'application/json');
    if ( c === "All" ) {
        Flower_Model.find({}).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    } else {
        Flower_Model.find({ 'category': c }).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    }
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/getflowersfilterthc/:thc', (req, res) => {
    let { thc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Flower_Model.find({ thc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Flower Data
// GET 
router.get('/getflowersfiltercbd/:cbd', (req, res) => {
    let { cbd } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Flower_Model.find({ cbd }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Prerolls Data
// GET 
router.get('/getprerollsfiltersize/:s', (req, res) => {
    let { s } = req.params;
    res.setHeader('Content-Type', 'application/json');
    AddPreRolls_Model.find({size: {$elemMatch: {'size': s}}}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Prerolls Data
// GET 
router.get('/getprerollsfiltercategory/:c', (req, res) => {
    let { c } = req.params;
    res.setHeader('Content-Type', 'application/json');
    if ( c === "All" ) {
        AddPreRolls_Model.find({}).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    } else {
        AddPreRolls_Model.find({ 'category': c }).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    }
});


// Database CRUD Operations
// @POST Request to GET the Prerolls Data
// GET 
router.get('/getprerollsfilterthc/:thc', (req, res) => {
    let { thc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    AddPreRolls_Model.find({ thc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Prerolls Data
// GET 
router.get('/getprerollsfiltercbd/:cbd', (req, res) => {
    let { cbd } = req.params;
    res.setHeader('Content-Type', 'application/json');
    AddPreRolls_Model.find({ cbd }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});



// Database CRUD Operations
// @POST Request to GET the Vapes Data
// GET 
router.get('/getvapesfiltersize/:s', (req, res) => {
    let { s } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Vapes_Model.find({size: {$elemMatch: {'size': s}}}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Vapes Data
// GET 
router.get('/getvapesfiltercategory/:c', (req, res) => {
    let { c } = req.params;
    res.setHeader('Content-Type', 'application/json');
    if ( c === "All" ) {
        Vapes_Model.find({}).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    } else {
        Vapes_Model.find({ 'category': c }).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    }
});


// Database CRUD Operations
// @POST Request to GET the Vapes Data
// GET 
router.get('/getvapesfiltersubcategory/:sc', (req, res) => {
    let { sc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Vapes_Model.find({ 'subcategory': sc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Vapes Data
// GET 
router.get('/getvapesfilterthc/:thc', (req, res) => {
    let { thc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Vapes_Model.find({ thc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Vapes Data
// GET 
router.get('/getvapesfiltercbd/:cbd', (req, res) => {
    let { cbd } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Vapes_Model.find({ cbd }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Extracts Data
// GET 
router.get('/getextractsfiltersize/:s', (req, res) => {
    let { s } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Extracts_Model.find({size: {$elemMatch: {'size': s}}}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Extracts Data
// GET 
router.get('/getextractsfiltercategory/:c', (req, res) => {
    let { c } = req.params;
    res.setHeader('Content-Type', 'application/json');
    if ( c === "All" ) {
        Extracts_Model.find({}).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    } else {
        Extracts_Model.find({ 'category': c }).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    }
});


// Database CRUD Operations
// @POST Request to GET the Extracts Data
// GET 
router.get('/getextractsfiltersubcategory/:sc', (req, res) => {
    let { sc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Extracts_Model.find({ 'subcategory': sc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Extracts Data
// GET 
router.get('/getextractsfilterthc/:thc', (req, res) => {
    let { thc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Extracts_Model.find({ thc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Extracts Data
// GET 
router.get('/getextractsfiltercbd/:cbd', (req, res) => {
    let { cbd } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Extracts_Model.find({ cbd }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});



// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/getediblesfiltersize/:s', (req, res) => {
    let { s } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Edibles_Model.find({size: {$elemMatch: {'size': s}}}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/getediblesfiltercategory/:c', (req, res) => {
    let { c } = req.params;
    res.setHeader('Content-Type', 'application/json');
    if ( c === "All" ) {
        Edibles_Model.find({}).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    } else {
        Edibles_Model.find({ 'category': c }).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    }
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/getediblesfiltersubcategory/:sc', (req, res) => {
    let { sc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Edibles_Model.find({ 'subcategory': sc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/getediblesfilterthc/:thc', (req, res) => {
    let { thc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Edibles_Model.find({ thc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/getediblesfiltercbd/:cbd', (req, res) => {
    let { cbd } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Edibles_Model.find({ cbd }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});



// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/gettropicalsfiltersize/:s', (req, res) => {
    let { s } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Tropicals_Model.find({size: {$elemMatch: {'size': s}}}).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/gettropicalsfiltercategory/:c', (req, res) => {
    let { c } = req.params;
    res.setHeader('Content-Type', 'application/json');
    if ( c === "All" ) {
        Tropicals_Model.find({}).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    } else {
        Tropicals_Model.find({ 'category': c }).sort({date: -1})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => res.status(400).json(`Error: ${err}`))
    }
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/gettropicalsfiltersubcategory/:sc', (req, res) => {
    let { sc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Tropicals_Model.find({ 'subcategory': sc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/gettropicalsfilterthc/:thc', (req, res) => {
    let { thc } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Tropicals_Model.find({ thc }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to GET the Edibles Data
// GET 
router.get('/gettropicalsfiltercbd/:cbd', (req, res) => {
    let { cbd } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Tropicals_Model.find({ cbd }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});



// Database CRUD Operations
// @POST Request to add Favorite
// POST
router.post('/addtofavorite', (req, res) => {
    const { useremail, product } = req.body;
    Favorite_Model.countDocuments({ productId: product._id })
    .then((count) => {
        if (count === 0) {
            const newFavorite = new Favorite_Model({
                productId: product._id,
                useremail,
                product
            });
            newFavorite.save()
                .then(() => {
                    res.status(200).json('Added to Favorite')
                })
                .catch(err => res.status(500).json(`Server Error is ${err}`))
        } else {
            res.status(200).json('Added to Favorite')
        }
    })
    .catch(err => res.status(500).json('Server Error'))
});


// Database CRUD Operations
// @POST Request to GET the Item
// GET 
router.get('/findallfavorites/:useremail', (req, res) => {
    const { useremail } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Favorite_Model.find({ useremail }).sort({date: -1})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @GET Request to DELETE from the Favorite List
// GET 
router.get('/removefavorite/:documentId', (req, res) => {
    const { documentId } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Favorite_Model.findOneAndDelete({ '_id': documentId })
        .then(data => {
            res.status(200).json('Removed')
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @POST Request to the Payment
// POST 
router.post('/charges', async (req, res) => {
    const {email, amount} = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'cad',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email,
    });

    res.json({'client_secret': paymentIntent['client_secret']})
});



// Database CRUD Operations
// @GET Request to get the orders of user
// GET 
router.get('/getusersdata/:email', (req, res) => {
    const { email } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Users_Model.find({ email })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});


// Database CRUD Operations
// @GET Request to get the orders of user
// GET 
router.post('/paymentsuccessfull', (req, res) => {
    const { transactionId, email, fullName, phoneno, address, zipcode, userId } = req.body;
    res.setHeader('Content-Type', 'application/json');
    SuccessfullPayment_Model.countDocuments({ transactionId })
    .then((count) => {
        if (count === 0) {
            const newSuccessfullPayment = new SuccessfullPayment_Model({
                transactionId,
                email,
                fullName,
                phoneno,
                address,
                zipcode
            });
            newSuccessfullPayment.save()
                .then(() => {
                    Cart_Model.updateMany({userId}, { 'payment': true }, { useFindAndModify: false })
                        .then(() => {
                            res.status(200).json('Users Update')
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => res.status(500).json(`Server Error is ${err}`))
        } else {
            res.status(200).json('Added')
        }
    })
    .catch(err => res.status(500).json('Server Error'))
});

// Database CRUD Operations
// @GET Request to get the track of the order
// GET 
router.get('/trackorder/:userId', (req, res) => {
    const { userId } = req.params;
    res.setHeader('Content-Type', 'application/json');
    Cart_Model.find({ 'completed': false, 'payment': true, 'userId': userId })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => res.status(400).json(`Error: ${err}`))
});

module.exports = router;