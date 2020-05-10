var router = global.router;
let User = require('../models/UserModel');
var mongoose = require('mongoose');

router.get('/login', (request, response) => {
  if (!request.query.username || !request.query.password) {
    response.json({
      result: "failed",
      data: [],
      messege: "Input parameters is wrong!. 'username' and 'password' must be not NULL"
    });
  }
  let login = {
    username: new RegExp('^' + request.query.username + '$', "i"),
    password: new RegExp('^' + request.query.password + '$', "i")
  };
  User.find(login).limit(100).sort().select({
    username: 1,
    password: 1,
  }).exec((err, users) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else if (users.length == 0) {
      response.json({
        result: "failed",
        messege: "Query check of login failed"
      });
    } else {
      response.json({
        result: "ok",
        messege: "Query check of login successfully"
      });
    }
  });
});

router.get('/my_account', (request, response) => {
  User.find({}).limit(100).sort({ name: 1 }).select({
    _id: 1,
    username: 1,
    ngay_sinh: 1,
    gioi_tinh: 1,
    email: 1,
    sdt: 1,
    dia_chi: 1,
    ro_le: 1,
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
        messege: "Query list of products successfully"
      });
    }
  });
});
module.exports = router;
