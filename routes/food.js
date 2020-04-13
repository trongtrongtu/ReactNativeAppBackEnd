/**
 * Created by hoangnd on 8/7/17.
 */
var router = global.router;
let Food = require('../models/FoodModel');

router.get('/list_all_foods', (request, response, next) => {
    //response.end("GET requested => list_all_foods");
    Food.find({}).limit(100).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, foods) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                messege: "Query list of foods successfully"
            });
        }
    });
});
//Example: http://localhost:3001/get_food_with_id?food_id=598a688878fee204ee51cd31
router.get('/get_food_with_id', (request, response, next) => {
    Food.findById(require('mongoose').Types.ObjectId(request.query.food_id),
        (err, food) => {
            if (err) {
                response.json({
                    result: "failed",
                    data: {},
                    messege: `Error is : ${err}`
                });
            } else {
                response.json({
                    result: "ok",
                    data: food,
                    messege: "Query food by Id successfully"
                });
            }
        });
});
//Example: http://localhost:3001/list_foods_with_criteria?name=salad&limit=10
router.get('/list_foods_with_criteria', (request, response, next) => {
    if (!request.query.name) {
        response.json({
            result: "failed",
            data: [],
            messege: "Input parameters is wrong!. 'name' must be not NULL"
        });
    }
    let criteria = {
        //name: new RegExp(request.query.name, "i"),// <=> where name like '%abc%' in sql
        //Example: http://localhost:3001/list_foods_with_criteria?name=japanese%20salad
        name: new RegExp('^' + request.query.name + '$', "i"),//"i" = case-insensitive
    };
    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;
    Food.find(criteria).limit(limit).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, foods) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                messege: "Query list of foods successfully"
            });
        }
    });
});
router.post('/insert_new_food', (request, response, next) => {
    console.log(`request.body.name = ${request.body.name}`);
    const newFood = new Food({
        name: request.body.name,
        foodDescription: request.body.foodDescription
    });
    newFood.save((err) => {
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
                    foodDescription: request.body.foodDescription,
                    messege: "Insert new food successfully"
                }
            });
        }
    });
});

router.put('/update_a_food', (request, response, next) => {
    response.end("PUT requested => update_a_food");
});

router.delete('/delete_a_food', (request, response, next) => {
    response.end("DELETE requested => delete_a_food");
});
module.exports = router;

