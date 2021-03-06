var router = global.router;
let Checkout = require('../models/CheckoutModel');
let Product = require('../models/ProductModel');
let mongoose = require('mongoose');

router.post('/checkout_product', (request, response) => {
    let name = request.body.name_product;
    Product.find({ name }).limit(100).sort({ name: 1 }).select({
        imageUrl: 1
    }).exec((err, users) => {
        const newCheckout = new Checkout({
            name_product: request.body.name_product,
            username: request.body.username,
            username_order: request.body.username_order,
            sdt_order: request.body.sdt_order,
            dia_chi_order: request.body.dia_chi_order,
            price_product: request.body.price_product,
            quantity: request.body.quantity,
            imageUrl: users[0].imageUrl,
            trang_thai: "ĐANG XỬ LÝ"
        });
        console.log(users)
        newCheckout.save((err) => {
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
                        name_product: request.body.name_product,
                        username: request.body.username,
                        username_order: request.body.username_order,
                        sdt_order: request.body.sdt_order,
                        dia_chi_order: request.body.dia_chi_order,
                        price_product: request.body.price_product,
                        quantity: request.body.quantity,
                        imageUrl: users[0].imageUrl,
                        trang_thai: "ĐANG XỬ LÝ",
                        messege: "Insert new checkout successfully"
                    }
                });
            }
        });
    });
});
router.get('/list_history_order', (request, response) => {
    let username = request.query.username;
    Checkout.find({ username }).limit(100).sort({ name: 1 }).select({
        name_product: 1,
        username: 1,
        username_order: 1,
        sdt_order: 1,
        dia_chi_order: 1,
        price_product: 1,
        quantity: 1,
        trang_thai: 1,
        imageUrl: 1
    }).exec((err, users) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: users,
                messege: "Query myaccount successfully"
            });
        }
    });
});
router.get('/list_order_users', (request, response) => {
    Checkout.find({}).limit(100).sort({ name: 1 }).select({
        name_product: 1,
        username: 1,
        username_order: 1,
        sdt_order: 1,
        dia_chi_order: 1,
        price_product: 1,
        quantity: 1,
        trang_thai: 1,
        imageUrl: 1
    }).exec((err, users) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: users,
                messege: "Query myaccount successfully"
            });
        }
    });
});
router.put('/modified_order', (request, response, next) => {
    var _id = mongoose.Types.ObjectId(request.body.order_id);
    var conditions = {};
    conditions._id = _id;
    let newValues = {
        trang_thai: request.body.trang_thai
    };
    const options = {
        new: true,
        multi: true
    }
    Checkout.findOneAndUpdate(conditions, { $set: newValues }, options, (err, updatedOrder) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot update existing product.Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: updatedOrder,
                messege: "Update user successfully"
            });
        }
    })
});
module.exports = router;