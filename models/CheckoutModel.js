'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CheckoutSchema = new Schema({
    username: {
        type: String,
    },
    username_order: {
        type: String,
    },
    sdt_order: {
        type: String,
    },
    dia_chi_order: {
        type: String,
    },
    quantity : {
        type: String
    },
    name_product: {
        type: String,
        required: true
    },
    price_product: {
        type: String,
        default: ""
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Checkout', CheckoutSchema);