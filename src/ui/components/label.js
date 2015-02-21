"use strict";

// function Label(_game, _x, _y, _width, _height) {
//     this.game = _game;
//     this.x = _x;
//     this.y = _y;
//     this.width = _width;
//     this.height = _height;
//     // this.caption = null;

//     this.label = this.game.add.bitmapText(this.x, this.y,
//                                          'Gamegirl', this.caption, 16);
// }

// Label.prototype = {
//     show: function(text) {
//         this.label.text = text;
//         this.label.visible = true;
//     },

//     render: function() {
//         if (!this.label.visible) {
//             return;
//         }
//         this.label.visible = false;
//     }

// };


module.exports.create = function(game, x, y, width, height) {
    // TODO: replace font and size with settings from config
    var label = game.add.bitmapText(x, y, 'Gamegirl', 'N/A', 16);
    // label.visible = false;
    return label;
}
