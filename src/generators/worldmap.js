var config          = require('config');
var PerlinGenerator = require('proc-noise');

var map = [];
var cfg = config.get('worldmap');

module.exports.generate = function() {
    var seed = Math.round(Math.random * 10000);
    var Perlin = new PerlinGenerator(seed);
    var map_raw = [];

    for (var y=0; y<cfg.world_height; y++) {
        for (var x=0; x<cfg.world_width; x++) {
            map_raw.push(Perlin.noise(x, y));
        }
    }

    fill(map_raw, map, 0.0, 1.0, 0);
    fill(map_raw, map, 0.3, 0.5, 1);
    fill(map_raw, map, 0.6, 0.75, 2);
};

module.exports.print = function() {
    var str = '';

    map.forEach(function(val, i) {
        str += i % cfg.world_width !== 0 ? ',' : '\n';
        str += val;
    });

    console.log(str);
};

function fill(data, output, lower, upper, value) {
    var count = 0;
    data.forEach(function(data_value, i) {
        if (data_value >= lower && data_value <= upper) {
            output[i] = value;
            count++;
        }
    });
    console.log('filled '+count+' tiles with '+value);
}

Object.defineProperty(module.exports, 'map', {
    get: function() { return map; }
});
