const getMetadata = (data) => {
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
    return meta;
}

const sort = (data, by = 'relevant', quality) => {
    var sorted = {};
    var result = [];
    if (by === 'helpful') {
        for (var review of data.reviews) {
            sorted[review.helpfulness] = review;
        }
        for (var review in sorted) {
            result.unshift(sorted[review]);
        }
    } else if (by === 'newest') {
        var today = (new Date()).toJSON().split('T')[0].split('-');
        for (var review of data.reviews) {
            var backthen = review.date.split('-');
            var since = 365 * (Number(today[0]) - Number(backthen[0]))
                + 31 * (Number(today[1]) - Number(backthen[1]))
                + (Number(today[2]) - Number(backthen[2]));
            sorted[since] = review;
        }
        for (var review in sorted) {
            //console.log(review, sorted[review].date);
            result.push(sorted[review]);
        }
    } else {
        if (quality === undefined) {
            result = data.reviews;
        } else {
            //sort by relevance, however that means
        }
    }
    //console.log(result);
    return result;
}

module.exports.getMetadata = getMetadata;
module.exports.sort = sort;