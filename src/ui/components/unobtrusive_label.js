"use strict";

// TODO:
// - set anchor
// - add support for bitmap text
// - use 9grid slicing for the background. Blit everything to a bitmapdata

function UnobtrusiveLabel(opts) {
    this.opts = opts || {
        game:   null,
        sprite: 'N/A'
    };

    if (opts.game === null) {
        console.log('Unobtrusive label could not be created. '+
                    'Pass a reference to game.');
        return;
    }

    this.label = this.opts.game.add.image(0, 0, this.opts.sprite);
    this.bottom = this.opts.game.world.height - (this.label.height * 2);
    this.top = this.label.height;

    this.label.x = this.opts.game.world.centerX - (this.label.width / 2);
    this.label.y = this.bottom;

    this.labelAtBottom = true;

    // this.tweenBottomOut = this.opts.game.add.tween(this.label);
    // this.tweenBottomIn = this.opts.game.add.tween(this.label);
    // this.tweenTopIn = this.opts.game.add.tween(this.label);
    // this.tweenTopOut = this.opts.game.add.tween(this.label);
}

UnobtrusiveLabel.prototype.update = function(pointer) {
    if (pointer.worldY > this.bottom && this.labelAtBottom) {
        this.labelAtBottom = false;
        this.tweenBottomOut = this.opts.game.add.tween(this.label).to({ y: this.opts.game.world.height }, 200, Phaser.Easing.Quadratic.Out, true);
        this.tweenBottomOut.onComplete.addOnce(this.fromAbove, this);
    }

    if (pointer.worldY < (this.top * 2) && !this.labelAtBottom) {
        this.labelAtBottom = true;
        this.tweenTopOut = this.opts.game.add.tween(this.label).to({ y: -this.label.height }, 200, Phaser.Easing.Quadratic.Out, true);
        this.tweenTopOut.onComplete.addOnce(this.fromBelow, this);
    }
};

UnobtrusiveLabel.prototype.fromAbove = function() {
    this.tweenBottomOut.onComplete.removeAll();
    this.label.y = -this.label.height;
    this.tweenTopIn = this.opts.game.add.tween(this.label).to({ y: this.top }, 100, Phaser.Easing.Quadratic.In, true);
    this.tweenTopIn.onComplete.addOnce(this.topInDone, this);
};

UnobtrusiveLabel.prototype.fromBelow = function() {
    this.tweenTopOut.onComplete.removeAll();
    this.label.y = this.opts.game.world.height;
    this.tweenBottomIn = this.opts.game.add.tween(this.label).to({ y: this.bottom }, 100, Phaser.Easing.Quadratic.In, true);
    this.tweenBottomIn.onComplete.addOnce(this.bottomInDone, this);
};

UnobtrusiveLabel.prototype.topInDone = function() {
    this.tweenTopIn.onComplete.removeAll();
};

UnobtrusiveLabel.prototype.bottomInDone = function() {
    this.tweenBottomIn.onComplete.removeAll();
};

module.exports.create = function(opts) {
    return new UnobtrusiveLabel(opts);
}
