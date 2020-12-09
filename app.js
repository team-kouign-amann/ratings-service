var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://psychout98:M%40rt33ny@3.15.194.153:27017",
    {useNewUrlParser: true, useUnifiedTopology: true});
var reviews = conn.useDb('reviews');
var ratings = reviews.collection('ratings');

app.use(bodyParser.json());

app.get('/reviews/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    ratings.findOne({id: Number(req.params.id)}).then((data) => {
        console.log(data);
        res.status(200).send(data);
    });
});

app.listen(3000, () => {
    console.log("Listening on 3000");
});