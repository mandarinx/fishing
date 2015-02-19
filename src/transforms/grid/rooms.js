var list = require('utils/list');

var rooms = {};

module.exports = {
    identify: function(index, grid) {

        var data = [];
        var rooms_tmp = [];

        grid.data.each(grid.width, function(tile, x, y, i) {
            data.push(tile);
        });

        data.forEach(function(tile, i) {
            if (tile === index && !inCache(rooms_tmp, tile)) {
                rooms_tmp.push({});
                crawl(data, grid.width, i, rooms_tmp[rooms_tmp.length-1]);
            }
        });

        rooms_tmp.forEach(function(room, i) {
            var indexes = Object.keys(room);
            rooms[i] = [];
            var r = rooms[i];

            indexes.forEach(function(index) {
                r.push(parseInt(index));
            });
        });
    },

    closeAll: function(grid) {
        Object.keys(rooms).forEach(function(room_num) {
            close(room_num, grid);
        });
    },

    open: function(room_num, grid) {
        if (!rooms[room_num]) {
            return;
        }

        var room = rooms[room_num];
        room.forEach(function(tile) {
            grid._[tile] = 0;
        });
    }
};

function close(room_num, grid) {
    var room = rooms[room_num];
    room.forEach(function(tile) {
        grid._[tile] = 1;
    });
}

function inCache(cache, index) {
    if (cache.length === 0) {
        return false;
    }

    for (var i=0; i<cache.length; i+=1) {
        var group = cache[i];
        return group[index] ? true : false;
    }
}

function crawl(data, width, i, container) {
    var index = data[i];
    var right = i+1;
    var left = i-1;
    var below = i+width;
    var above = i-width;

    data[i] = 3;
    container[i] = true;

    if (data[right] === index) {
        crawl(data, width, right, container);
    }
    if (data[left] === index) {
        crawl(data, width, left, container);
    }
    if (data[below] === index) {
        crawl(data, width, below, container);
    }
    if (data[above] === index) {
        crawl(data, width, above, container);
    }
}

Object.defineProperty(module.exports, 'rooms', {
    get: function() { return rooms; }
});
