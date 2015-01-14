var list = require('utils/list');

function Grid(width, height, value) {
    var w = width;
    var h = height;
    var data = [];
    var tiles = [];

    var instance = {
        init: function(value) {
            value = value || 0;
            for (var i=0, l=w * h; i<l; i++) {
                data.push(value);
                tiles.push(value);
            }
        }
    };

    if (typeof value !== 'undefined') {
        instance.init(value);
    }

    get(instance, 'width', function() {
        return w;
    });

    get(instance, 'height', function() {
        return data.length / w;
    });

    get(instance, 'length', function() {
        return data.length;
    });

    getset(instance, 'data', function() { return data; },
                             function() { data = value; });

    getset(instance, 'tiles', function() { return tiles; },
                              function() { tiles = value; });

    return instance;
}

function get(obj, prop, cb) {
    Object.defineProperty(obj, prop, { get: cb });
}

function getset(obj, prop, get_cb, set_cb) {
    Object.defineProperty(obj, prop, { get: get_cb, set: set_cb });
}

module.exports.create = function(width, height, value) {
    return new Grid(width, height, value);
}
