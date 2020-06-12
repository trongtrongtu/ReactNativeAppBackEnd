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
        type: String,
    },
    dia_chi: {
        type: String,
    },
    ro_le: {
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema);