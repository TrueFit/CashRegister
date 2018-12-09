const checkRandomTwist = (value, factor) => {
    return value % factor === 0;
}

const parseCSV = (input) => {
    var rows = input.split(/\r?\n/);
    return rows.map(function (row) {
        return row.split(",").reduce(function (map, val, i) {
            if (i === 0) map["owed"] = val;
            if (i === 1) map["paid"] = val;
            return map;
        }, {});
    });
}

const roundedDecimal = value => Math.round(value * 100) / 100; // Round to 2 decimal places.

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

export {checkRandomTwist, parseCSV, roundedDecimal, getRandomArbitrary};
