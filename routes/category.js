var router = global.router;
let Category = require('../models/CategoryModel');
let Product = require('../models/ProductModel');
var mongoose = require('mongoose');

router.post('/insert_new_category', (request, response, next) => {
    const criteria = {
        name: new RegExp('^' + request.body.name.trim() + '$', "i")
    };
    Category.find(criteria).limit(1).exec((err, categories) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            //If it exist, donot allow to insert !
            if (categories.length > 0) {
                response.json({
                    result: "failed",
                    data: [],
                    messege: "Can not insert because the name exists"
                });
            } else {
                //Can insert
                const newCategory = new Category({
                    name: request.body.name,
                    description: request.body.description
                });
                newCategory.save((err, addedCategory) => {
                    if (err) {
                        response.json({
                            result: "failed",
                            data: {},
                            messege: `Error is : ${err}`
                        });
                    } else {
                        response.json({
                            result: "ok",
                            data: addedCategory,
                            messege: "Insert new category successfully"
                        });
                    }
                });
            }
        }
    });
});
router.delete('/delete_a_category', (request, response, next) => {
    Category.findOneAndRemove({ _id: mongoose.Types.ObjectId(request.body.category_id) }, (err) => {
        if (err) {
            response.json({
                result: "failed",
                messege: `Cannot delete a category. Error is : ${err}`
            });
            return;
        }
        Product.findOneAndRemove({ categoryId: mongoose.Types.ObjectId(request.body.category_id) }, (err) => {
            if (err) {
                response.json({
                    result: "failed",
                    messege: `Cannot delete Food with categoryId: ${request.body.category_id}. Error is : ${err}`
                });
                return;
            }
            response.json({
                result: "ok",
                messege: "Delete category and Food with categoryId successful"
            });
        });
    });
});
module.exports = router;