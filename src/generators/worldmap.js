var config          = require('config');
var PerlinGenerator = require('proc-noise');
var grid            = require('data/grid');
var list            = require('utils/list');

var map = {};
var cfg = {};

module.exports.generate = function(data_types) {
    cfg = config.get('worldmap');

    var seed = Math.round(Math.random * 10000);
    var Perlin = new PerlinGenerator(seed);
    var noise = [];
    var scale = 1 / cfg.noise_scale;

    map = grid.create(cfg.world_width, cfg.world_height, 0);

    list.fill(noise, map.width, map.length, function(x, y, i) {
        noise[i] = Perlin.noise(x * scale, y * scale);
    });

    filter(noise, map, data_types);
};

module.exports.print = function() {
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
        if (value >= cfg.lower && value < cfg.upper) {
            return cfg.value;
        }
    }
}

Object.defineProperty(module.exports, 'map', {
    get: function() { return map; }
});
