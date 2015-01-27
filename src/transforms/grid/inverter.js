module.exports.invert = function(data, from, to) {
    var from = from || 0;
    var to = to || 1;
    data.fill(function(tile, x, y, i) {
        return tile === from ? to : from;
    });
}
