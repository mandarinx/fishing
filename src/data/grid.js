var list = require('utils/list');

function Grid(width, height, value) {
    var w = width;
    var h = height;

    var instance = {
        data:   [],
        tiles:  [],
        name:   'Unnamed',
        seed:   1,

        init: function(value) {
            value = value || 0;
            for (var i=0, l=w * h; i<l; i++) {
                this.data.push(value);
                this.tiles.push(value);
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
        return this.data.length / w;
    });

    get(instance, 'length', function() {
        return this.data.length;
    });

    return instance;
}

function get(obj, prop, cb) {
    Object.defineProperty(obj, prop, {
        get: cb,
        enumerable: true
    });
}

function set(obj, prop, cb) {
    Object.defineProperty(obj, prop, {
        set:        cb,
        enumerable: true
    });
}

function getset(obj, prop, get_cb, set_cb) {
    Object.defineProperty(obj, prop, {
        // get:        get_cb,
        // set:        set_cb,
        enumerable: true,
        writable:   true,
        configurable:   true
    });
}

module.exports.create = function(width, height, value) {
    return new Grid(width, height, value);
}
