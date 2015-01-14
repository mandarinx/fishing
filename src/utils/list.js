module.exports.each = function(list, width, callback) {
    if (!callback) {
        console.warn('each() missing callback');
        return;
    }

    var x = 0;
    var y = 0;

    list.forEach(function(item, i) {
        x = i % width !== 0 ? x + 1 : 0;
        y = i > 0 && x === 0 ? y + 1 : y;
        callback(item, x, y, i);
    });
};

module.exports.get = function(arr, x, y, width) {
    return arr[(width * y) + x];
};

module.exports.set = function(arr, x, y, width, value) {
    arr[(width * y) + x] = value;
};

module.exports.fill = function(arr, width, length, callback) {
    if (!arr) {
        arr = [];
    }

    var x = 0;
    var y = 0;

    for (var i=0; i<length; i+=1) {
        x = i % width !== 0 ? x + 1 : 0;
        y = i > 0 && x === 0 ? y + 1 : y;
        callback(x, y, i);
    }
};

module.exports.print = function(list, width) {
    var str = this.printString(list, width);
    console.log(str);
}

module.exports.printString = function(list, width) {
    if (!(list instanceof Array)) {
        console.log('list.print() needs an array');
        return;
    }

    if (typeof width === 'undefined') {
        var width = Math.sqrt(list.length);
        if (width % 1 !== 0) {
            console.log('list.print() cannot find the width for the current list');
            return;
        }
    }

    var str = '';

    this.each(list, width, function(tile, x, y, i) {
        str += i % width !== 0 ? ',' : '\n';
        str += tile;
    });

    return str;
}
