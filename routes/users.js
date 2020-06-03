var router = global.router;
let User = require('../models/UserModel');
var mongoose = require('mongoose');

router.get('/login', (request, response) => {
  let login = {
    username: request.query.username,
    password: request.query.password
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
  let username = request.query.username
  User.find({ username }).limit(100).sort({ name: 1 }).select({
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
        messege: "Query myaccount successfully"
      });
    }
  });
});

router.post('/register', (request, response) => {
  let username = request.body.username;
  User.find({ username }).limit(100).sort({ name: 1 }).select({
    username: 1
  }).exec((err, users) => {
    if (users.length == 1) {
      count = 1;
      response.json({
        result: "failed",
        data: users,
        messege: "username already exists"
      });
    } else {
      const newUser = new User({
        username: request.body.username,
        password: request.body.password,
        ngay_sinh: request.body.ngay_sinh,
        gioi_tinh: request.body.gioi_tinh,
        email: request.body.email,
        sdt: request.body.sdt,
        dia_chi: request.body.dia_chi,
        ro_le: 1
      });
      newUser.save((err) => {
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
              username: request.body.username,
              ngay_sinh: request.body.ngay_sinh,
              gioi_tinh: request.body.gioi_tinh,
              email: request.body.email,
              sdt: request.body.sdt,
              dia_chi: request.body.dia_chi,
              ro_le: 1,
              messege: "Insert new user successfully"
            }
          });
        }
      });
    }
  });

});
router.put('/update_user', (request, response, next) => {
  var username = request.body.username;
  var conditions = {};
  User.find({ username }).limit(100).sort({ name: 1 }).select({
    _id: 1
  }).exec((err, users) => {
    conditions._id = users[0]._id;
    let newValues = {
      username: request.body.username,
      ngay_sinh: request.body.ngay_sinh,
      gioi_tinh: request.body.gioi_tinh,
      email: request.body.email,
      sdt: request.body.sdt,
      dia_chi: request.body.dia_chi,
    };
    const options = {
      new: true,
      multi: true
    }
    User.findOneAndUpdate(conditions, { $set: newValues }, options, (err, updatedUser) => {
      if (err) {
        response.json({
          result: "failed",
          data: {},
          messege: `Cannot update existing product.Error is : ${err}`
        });
      } else {
        response.json({
          result: "ok",
          data: updatedUser,
          messege: "Update user successfully"
        });
      }
    });
  })
});
router.put('/update_password', (request, response, next) => {
  var username = request.body.username;
  var conditions = {};
  User.find({ username }).limit(100).sort({ name: 1 }).select({
    _id: 1
  }).exec((err, users) => {
    conditions._id = users[0]._id;
    let newValues = {
      password: request.body.new_password
    };
    const options = {
      new: true,
      multi: true
    }
    if (users[0].password == request.body.old_password) {
      User.findOneAndUpdate(conditions, { $set: newValues }, options, (err, updatedUser) => {
        if (err) {
          response.json({
            result: "failed",
            data: {},
            messege: `Cannot update existing product.Error is : ${err}`
          });
        } else {
          response.json({
            result: "ok",
            data: updatedUser,
            messege: "Update user successfully"
          });
        }
      });
    } else {
      response.json({
        result: "failed",
        data: {},
        messege: 'Cannot update password'
      });
    }
  })
});

module.exports = router;
