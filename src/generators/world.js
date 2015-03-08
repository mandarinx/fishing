var config          = require('config');
var PerlinGenerator = require('proc-noise');
var grid            = require('data/grid');
var list            = require('utils/list');
var type            = require('utils/type');

var map = {};
var cfg = {};

module.exports.generate = function(data_types, seed) {
    cfg = config.get('world');

    var Perlin = new PerlinGenerator(seed);
    var noise = [];
    var scale = 1 / cfg.noise_scale;

    map = grid.create(cfg.width, cfg.height, 0);

    list.fill(noise, map.width * map.height, 0);
    noise.each(map.width, function(tile, x, y, i) {
        noise[i] = Perlin.noise(x * scale, y * scale);
    });

    filter(noise, map, data_types);

    list.print(map.data);
};

function filter(data, grid, config) {
    data.forEach(function(data_value, i) {
        grid.data[i] = filterValue(data_value, config);
    });
}

function filterValue(value, config) {
    for (var i=0; i<config.length; i++) {
        var cfg = config[i];
        if (type(cfg.lower).is_undefined &&
            type(cfg.upper).is_undefined) {
            continue;
        }
        if (value >= cfg.lower && value < cfg.upper) {
            return cfg.value;
        }
    }
}

Object.defineProperty(module.exports, 'map', {
    get: function() { return map; }
});
