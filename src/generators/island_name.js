
var endings = ['os', 'ia'];
var beginnings = ['Nax', 'Lesb', 'K', 'Icar', 'Tin', 'Skyr'];

module.exports.generate = function() {
    var b = rnd(beginnings);
    var e = rnd(endings);
    return b+e;
};

function rnd(list) {
    return list[Math.round(Math.random() * (list.length-1))];
}
