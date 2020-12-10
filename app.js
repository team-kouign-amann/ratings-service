var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
//psychout98:M%40rt33ny@3.15.194.153:27017
var conn = mongoose.createConnection("mongodb://127.0.0.1",
    {useNewUrlParser: true, useUnifiedTopology: true});
var reviews = conn.useDb('reviews');
var ratings = reviews.collection('products');
var utils = require('./reviewUtils.js');

app.use(bodyParser.json());

app.get('/reviews(/meta)?(/:id)?', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    //console.log(req.query, req.params);
    var query = {
        meta: req.params['0'] === '/meta',
        id: req.params.id || req.query.id
    };
    if (query.id === undefined) {
        res.status(404).send();
    } else {
    ratings.findOne({id: Number(query.id)}).then((data) => {
        //console.log(data);
        if (query.meta) {
            res.status(200).send(utils.getMetadata(data));
        } else {
            res.status(200).send({
                reviews: utils.sort(data, req.query.sort),
                characteristics: data.characteristics
            });
        }
    });
    }
});

app.put('/reviews(/:id)?(/:index)?(/:change)?', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.query, req.params);
    var id = req.params.id || req.query.id;
    var index = req.params.index || req.query.index;
    var method = req.params.change || req.query.change;
    if (id === undefined || index === undefined || method === undefined) {
        res.status(400).send();
    } else {
        ratings.findOne({id: Number(id)}).then((data) => {
            console.log(data.reviews[Number(index)], method);
            //change review
        });
        res.status(200).send();
    }
});

app.post('/reviews(/:id)?', (req, res) => {
    var id = req.params.id || req.query.id;
    if (id === undefined) {
        res.status(400).send();
    } else {
        console.log('add', req.body, ' to product_id: ', id);
        // check if it's a valid review then add it to product.reviews with index = reviews.length
        // probably will need to findOne, 
        res.status(200).send();
    }
});

app.listen(3000, () => {
    console.log("Listening on 3000");
});