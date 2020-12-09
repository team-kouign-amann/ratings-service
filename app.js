var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://psychout98:M%40rt33ny@3.15.194.153:27017",
    {useNewUrlParser: true, useUnifiedTopology: true});
var reviews = conn.useDb('reviews');
var ratings = reviews.collection('ratings');
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

app.post('/reviews/:id', (req, res) => {
    console.log(req.params);
    console.log(req.body);
    res.status(200).send();
});

app.listen(3000, () => {
    console.log("Listening on 3000");
});