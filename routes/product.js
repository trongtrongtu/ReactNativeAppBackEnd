var router = global.router;
let Product = require('../models/ProductModel');
var mongoose = require('mongoose');
let fs = require('fs');

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
    let newValues = {};
    const serverPort = require("../app").settings.port;
    newValues.imageUrl = `192.168.1.138:${serverPort}/open_image?image_name=${request.body.image_name}`
    const newProduct = new Product({
        name: request.body.name,
        productDescription: request.body.productDescription,
        imageUrl: newValues.imageUrl
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
                    imageUrl: newValues.imageUrl,
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
    if (request.body.image_name && request.body.image_name.length > 0) {
        //http://192.168.1.138:3001/open_image?image_name=upload_e2312e497df8c230b4896fa3b43bb543.jpg
        const serverPort = require("../app").settings.port;
        newValues.imageUrl = `192.168.1.138:${serverPort}/open_image?image_name=${request.body.image_name}`
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

router.post('/upload_images', (request, response, next) => {
    let formidable = require('formidable');
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
    form.multiples = true;
    form.parse(request, (err, fields, files) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot upload images.Error is : ${err}`
            });
        }

        var arrayOfFiles = [];
        if (files[""] instanceof Array) {
            arrayOfFiles = files[""];
        } else {
            arrayOfFiles.push(files[""]);
        }

        if (arrayOfFiles.length > 0) {
            var fileNames = [];
            arrayOfFiles.forEach((eachFile) => {
                // fileNames.push(eachFile.path)
                fileNames.push(eachFile.path.split('/')[1]);
            });
            response.json({
                result: "ok",
                data: fileNames,
                numberOfImages: fileNames.length,
                messege: "Upload images successfully"
            });
        } else {
            response.json({
                result: "failed",
                data: {},
                numberOfImages: 0,
                messege: "No images to upload !"
            });
        }
    });
});
router.get('/open_image', (request, response, next) => {
    let imageName = "uploads/" + request.query.image_name;
    fs.readFile(imageName, (err, imageData) => {
        if (err) {
            response.json({
                result: "failed",
                messege: `Cannot read image.Error is : ${err}`
            });
            return;
        }
        response.writeHead(200, { 'Content-Type': 'image/jpeg' });
        response.end(imageData); // Send the file data to the browser.
    });
});

router.delete('/delete_a_product', (request, response, next) => {
    Product.findOneAndRemove({ _id: mongoose.Types.ObjectId(request.body.product_id) }, (err) => {
        if (err) {
            response.json({
                result: "failed",
                messege: `Cannot delete product. Error is : ${err}`
            });
            return;
        }
        response.json({
            result: "ok",
            messege: "Delete product with product_id successful"
        });
    });
});
module.exports = router;
