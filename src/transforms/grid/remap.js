// map:
// {
//     0: 1,
//     1: 2
// }

var list            = require('utils/list');

module.exports.remap = function(input, map) {
    var map_to = -1;
    input.forEach(function(tile, i) {
        map_to = map[tile];
        input[i] = map_to;
    });
};
