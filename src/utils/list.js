module.exports.get = function(arr, x, y, width) {
    return arr[(width * y) + x];
};

module.exports.set = function(arr, x, y, width, value) {
    arr[(width * y) + x] = value;
};

module.exports.fill = function(arr, length, value) {
    arr = arr || [];
    value = value || 0;

    for (var i=0; i<length; i+=1) {
        arr.push(value);
    }

    return module.exports;
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

    // this.each(list, width, function(tile, x, y, i) {
    list.each(width, function(tile, x, y, i) {
        str += i % width !== 0 ? ',' : '\n';
        str += tile;
    });

    return str;
}
