var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://psychout98:M%40rt33ny@3.15.194.153:27017",
    {useNewUrlParser: true, useUnifiedTopology: true});
var reviews = conn.useDb('reviews');
var ratings = reviews.collection('ratings');

app.use(bodyParser.json());

app.get('/reviews(/meta)?/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    ratings.findOne({id: Number(req.params.id)}).then((data) => {
        if (req.params['0'] === undefined) {
            res.status(200).send(data);
        } else {
            var meta = {
                'product_id': data.id,
                'ratings' : {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
                'recommended' : 0,
                'characteristics' : {}};
            var chars = {};
            for (var item of data.characteristics) {
                meta['characteristics'][item] = 0;
                chars[item] = 0;
            }
            for (var review of data.reviews) {
                meta['ratings'][review.rating] ++;
                meta['recommended'] += review.recommend ? 1 : 0;
                for (var char of review.characteristics) {
                    var total = chars[char.name] * meta['characteristics'][char.name];
                    chars[char.name]++;
                    meta['characteristics'][char.name] = Number(((total + char.value) / chars[char.name]).toFixed(2));
                }
            }
            res.status(200).send(meta);
        }
    });
});
app.post('/reviews/:id', (req, res) => {
    console.log(req.params);
    console.log(req.body);
    res.status(200).send();
});

app.listen(3000, () => {
    console.log("Listening on 3000");
});