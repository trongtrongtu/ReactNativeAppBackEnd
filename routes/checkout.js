var router = global.router;
let Checkout = require('../models/CheckoutModel');

router.post('/checkout_product', (request, response) => {
    const newCheckout = new Checkout({
        name_product: request.body.name_product,
        username: request.body.username,
        username_order: request.body.username_order,
        sdt_order: request.body.sdt_order,
        dia_chi_order: request.body.dia_chi_order,
        price_product: request.body.price_product,
        quantity: request.body.quantity,
        trang_thai: "ĐANG XỬ LÝ"
    });
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
                    trang_thai: "ĐANG XỬ LÝ",
                    messege: "Insert new checkout successfully"
                }
            });
        }
    });
});
module.exports = router;