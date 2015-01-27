"use strict";

// THOUGHTS:
// - To add a more boat-like feel to the movement, a slowdown on stop would
//   be nice. Also a bit of slowness at start.
// - Turning radius should be a factor of speed. Greater radius at greater
//   speeds.
var sprite;
var speed = 2;
var dir = {x:0, y:0};

module.exports.create = function(game, x, y) {
    sprite = game.add.sprite(x, y, 'sprites01');
    sprite.anchor.setTo(0.5, 0.5);
};

module.exports.update = function(cursors, pointer) {

    if (cursors.up.isDown) {
        dir.y = -1;
        dir.x = !cursors.right.isDown && !cursors.left.isDown ? 0 : dir.x;
    } else if (cursors.down.isDown) {
        dir.y = 1;
        dir.x = !cursors.right.isDown && !cursors.left.isDown ? 0 : dir.x;
    }

    if (cursors.right.isDown) {
        dir.x = 1;
        dir.y = !cursors.up.isDown && !cursors.down.isDown ? 0 : dir.y;
    } else if (cursors.left.isDown) {
        dir.x = -1;
        dir.y = !cursors.up.isDown && !cursors.down.isDown ? 0 : dir.y;
    }

    // sprite.x -= speed;
    // sprite.y -= speed;

    log(Math.atan2(dir.y, dir.x));
};
