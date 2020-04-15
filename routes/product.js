var router = global.router;
let Product = require('../models/ProductModel');
var mongoose = require('mongoose');

router.get('/list_all_products', (request, response, next) => {
    Product.find({}).limit(100).sort({ name: 1 }).select({
        name: 1,
        productDescription: 1,
        created_date: 1,
        status: 1,
        imageUrl: 1,
    }).exec((err, products) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: products,
                count: products.length,
                messege: "Query list of products successfully"
            });
        }
    });
});
router.get('/get_product_with_id', (request, response, next) => {
    Product.findById(require('mongoose').Types.ObjectId(request.query.product_id),
        (err, product) => {
            if (err) {
                response.json({
                    result: "failed",
                    data: {},
                    messege: `Error is : ${err}`
                });
            } else {
                response.json({
                    result: "ok",
                    data: product,
                    messege: "Query product by Id successfully"
                });
            }
        });
});
router.get('/list_products_with_criteria', (request, response, next) => {
    if (!request.query.name) {
        response.json({
            result: "failed",
            data: [],
            messege: "Input parameters is wrong!. 'name' must be not NULL"
        });
    }
    let criteria = {
        name: new RegExp('^' + request.query.name + '$', "i"),
    };
    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;
    Product.find(criteria).limit(limit).sort({ name: 1 }).select({
        name: 1,
        productDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, products) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: products,
                count: products.length,
                messege: "Query list of products successfully"
            });
        }
    });
});
router.post('/insert_new_product', (request, response, next) => {
    console.log(`request.body.name = ${request.body.name}`);
    const newProduct = new Product({
        name: request.body.name,
        productDescription: request.body.productDescription
    });
    newProduct.save((err) => {
        debugger;
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: {
                    name: request.body.name,
                    productDescription: request.body.productDescription,
                    messege: "Insert new product successfully"
                }
            });
        }
    });
});

router.put('/update_a_product', (request, response, next) => {
    let conditions = {};
    if (mongoose.Types.ObjectId.isValid(request.body.product_id) == true) {
        conditions._id = mongoose.Types.ObjectId(request.body.product_id);
    } else {
        response.json({
            result: "failed",
            data: {},
            messege: "You must enter product_id to update"
        });
    }
    let newValues = {};
    if (request.body.name && request.body.name.length > 2) {
        newValues.name = request.body.name;
    }
    if (request.body.productDescription && request.body.productDescription.length > 2) {
        newValues.productDescription = request.body.productDescription;
    }
    const options = {
        new: true,
        multi: true
    }
    if (mongoose.Types.ObjectId.isValid(request.body.category_id) == true) {
        newValues.categoryId = mongoose.Types.ObjectId(request.body.category_id);
    }
    Product.findOneAndUpdate(conditions, { $set: newValues }, options, (err, updatedProduct) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot update existing product.Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: updatedProduct,
                messege: "Update product successfully"
            });
        }
    });
});

router.delete('/delete_a_product', (request, response, next) => {
    response.end("DELETE requested => delete_a_product");
});
module.exports = router;
