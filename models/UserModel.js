'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    ngay_sinh: {
        type: Date,
    },
    gioi_tinh: {
        type: String,
    },
    email: {
        type: String,
    },
    sdt: {
        type: Number,
    },
    dia_chi: {
        type: String,
    },
    ro_le: {
        type: Number,
    },
});

module.exports = mongoose.model('User', UserSchema);