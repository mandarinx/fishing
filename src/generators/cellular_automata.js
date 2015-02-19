var list        = require('utils/list');
// var inverter    = require('transforms/grid/inverter');
// var rooms       = require('transforms/grid/rooms');

var data = null;
var data_string = null;
var options = {};

module.exports = {
    generate: function(grid, opt) {
        options = opt || {
            seed:       1,
            smoothness: 1,
            padding:    1,
            value_a:    0,
            value_b:    1
        };

        Math.seed = options.seed;

        grid.data.each(grid.width, function(value, x, y, i) {
        // list.each(grid.data, grid.width, function(item, x, y, i) {
            if ((x < options.padding) ||
                (y < options.padding) ||
                (x >= grid.width - options.padding) ||
                (y >= grid.width - options.padding)) {
                grid.data[i] = 0;
            } else {
                grid.data[i] = ~~Math.seededRandom(0, 2);
            }
        });

        generateCells(grid, options);

        // inverter.invert(data);

        // rooms.identify(0, data);
        // rooms.closeAll(data);
        // rooms.open(0, data);

        // addOutlineWalls();
        // addHeight();

        // list.print(grid.data);

    }
};

function generateCells(grid, options) {
    for (var i = 0; i < options.smoothness; i++) {

        var new_map = [];
        list.fill(new_map, grid.width * grid.width, 0);

        var x_low = -1;
        var x_high = -1;
        var y_low = -1;
        var y_high = -1;
        var neighbours = 0;
        var cur_tile_value = -1;
        var corner = false;
        var val = -1;

        // list.each(new_map, grid.width, function(tile, x, y, i) {
        new_map.each(grid.width, function(tile, x, y, i) {

            x_low = Math.max(0, x - 1);
            x_high = Math.min(grid.width - 1, x + 1);

            y_low = Math.max(0, y - 1);
            y_high = Math.min(grid.width - 1, y + 1);

            neighbours = 0;

            for (var a = x_low; a <= x_high; a++) {
                for (var b = y_low; b <= y_high; b++) {
                    if ((a === x) && (b === y)) {
                        continue;
                    }
                    neighbours += 1 - get(grid, a, b);
                }
            }

            cur_tile_value = get(grid, x, y);

            corner = (x === 0 && y === 0) ||
                     (x === grid.width-1 && y === 0) ||
                     (x === 0 && y === grid.height-1) ||
                     (x === grid.width-1 && y === grid.height-1);

            val = (corner ||
                  (cur_tile_value === 0 && neighbours >= 4) ||
                  (cur_tile_value === 1 && neighbours >= 5)) ? 0 : 1;

            list.set(new_map, x, y, grid.width, val);

        });

        new_map.forEach(function(value, i) {
            grid.data[i] = new_map[i];
        });
    }

    grid.data.forEach(function(value, i) {
        grid.data[i] = value === 0 ? options.value_a : options.value_b;
    });
}

function get(grid, x, y) {
    return list.get(grid.data, x, y, grid.width);
}

// function filter(data, data_types) {
//     data.forEach(function(data_value, i) {
//         data[i] = filterValue(data_value, data_types);
//     });
// }

// function filterValue(value, data_types) {
//     for (var i=0; i<data_types.length; i++) {
//         var dtype = data_types[i];
//         if (value >= dtype.lower && value < dtype.upper) {
//             return dtype.value;
//         }
//     }
// }

// TODO:
// addHeight and addOutlineWalls are actually transformers, and should
// be put in separate files.

// function addHeight() {
//     data.each(function(tile, x, y) {
//         if (tile === 0 &&
//             data.get(x, y - 1) === 1) {
//             data.set(x, y, 2);
//         }
//     });
// }

// function addOutlineWalls() {
//     data.each(function(tile, x, y) {
//         if (tile === 0) {
//             if (((x > 0) && (data.get(x - 1, y) === 1)) ||
//                 ((y > 0) && (data.get(x, y - 1) === 1)) ||
//                 ((x < data.width - 1) && (data.get(x + 1, y) === 1)) ||
//                 ((y < data.width - 1) && (data.get(x, y + 1) === 1))) {
//                     data.set(x, y, 2);
//                 }
//         }

//     });
// }
