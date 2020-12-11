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
        for (var char in review.characteristics) {
            var total = chars[char] * meta['characteristics'][char];
            chars[char]++;
            meta['characteristics'][char] = Number(((total + review.characteristics[char])
                / chars[char]).toFixed(2));
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

const defaultValue = (key) => {
    if (key === 'photos') {
        return [];
    }
    if (key === 'characteristics') {
        return {};
    }
    if (key === 'rating') {
        return 5;
    }
    if (key === 'date') {
        return (new Date()).toJSON().slice(0, 10);
    }
    if (key === 'summary' || key === 'body'
        || key === 'reviewer_name' || key === 'reviewer_email') {
        return '';
    }
    if (key === 'recommend' || key === 'reported') {
        return false;
    }
    if (key === 'response') {
        return null;
    }
    if (key === 'helpfulness') {
        return 0;
    }
}

module.exports.getMetadata = getMetadata;
module.exports.sort = sort;
module.exports.defaultValue = defaultValue;