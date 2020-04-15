'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        default: ""
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['available', 'unavailable']
        }],
        default: ['available']
    },
    categoryId: Schema.ObjectId
});
ProductSchema.path('name').set( (inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
});
module.exports = mongoose.model('Product', ProductSchema);