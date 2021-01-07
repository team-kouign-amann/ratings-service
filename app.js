var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var conn = mongoose.createConnection("mongodb://user:pass@3.15.194.153:27017",
    {useNewUrlParser: true, useUnifiedTopology: true});
var reviews = conn.useDb('reviews');
var ratings = reviews.collection('products');
var utils = require('./reviewUtils.js');

app.use(bodyParser.json());

app.get('/reviews(/meta)?(/:id)?', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    // console.log(req.query, req.params);
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
    })
    .catch(() => res.status(400).send());
    }
});

app.put('/reviews(/:id)?(/:index)?(/:change)?', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    var id = req.params.id || req.query.id;
    var index = req.params.index || req.query.index;
    var method = req.params.change || req.query.change;
    if (id === undefined || index === undefined || method === undefined) {
        res.status(400).send();
    } else {
        ratings.findOne({id: Number(id)}).then((data) => {
            if (data === undefined) {
                res.status(400).send();
            } else {
                var revs = data.reviews;
                var valid = false;
                if (method === 'helpful') {
                    revs[Number(index)]['helpfulness']++;
                    valid = true;
                } else if (method === 'report') {
                    revs[Number(index)]['reported'] = true;
                    valid = true;
                } else {
                    res.status(400).send();
                }
                if (valid) {
                    ratings.findOneAndUpdate({id: Number(id)}, {$set: {reviews: revs}}, {new: true})
                        .then((result) => res.status(200).send(result.value))
                            .catch(() => res.status(400).send());
                }
            }
        });
    }
});

app.post('/reviews(/:id)?', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    var id = req.params.id || req.query.id;
    if (id === undefined) {
        res.status(400).send();
    } else {
        ratings.findOne({id: Number(id)}).then((data) => {
            if (data === undefined) {
                res.status(400).send();
            } else {
                var revs = data.reviews;
                var keys = ['photos', 'characteristics', 'rating',
                    'date', 'summary', 'body', 'recommend', 'reported',
                    'reviewer_name', 'reviewer_email', 'response', 'helpfulness'];
                var post = req.body.review;
                post.index = revs.length;
                for (var key of keys) {
                    if (post[key] === undefined) {
                        post[key] = utils.defaultValue(key);
                    }
                }
                revs = revs.concat(post);
                ratings.findOneAndUpdate({id: Number(id)}, {$set: {reviews: revs}}, {new: true})
                        .then(() => res.status(200).send('posted'))
                        .catch(() => res.status(400).send());
            }
        });
    }
});

app.listen(3000, () => {
    console.log("Listening on 3000");
});
