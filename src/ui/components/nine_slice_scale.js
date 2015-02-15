"use strict";

// TODO: fix!

// TODO: add validations and fallbacks to constructor properties

// use:
// var image = game.cache.getImage('panel');
// var panel = nine_slice_scale.create(game, image);

// TODO:
// panel.scaleX(new_width);
// panel.scaleY(new_height);
// panel.anchor.setTo(x, y);

var ScaledImage = function(game, key, slice) {
    this.game = game;

    var image = game.cache.getImage(key);
    this.bitmapData = new Phaser.BitmapData(game, key,
                                            image.width, image.height);

    // this.bitmapData = new Phaser.BitmapData(this.game,
    //                                         image.width,
    //                                         image.height);
    // this.bitmapData.context.drawImage(image, 0, 0);

    this.width = this.bitmapData.width;
    this.height = this.bitmapData.height;

    // log(this.width, this.height);
    log(this.bitmapData.context);

    this.top = slice.top;
    this.right = slice.right;
    this.bottom = slice.bottom;
    this.left = slice.left;

    this.data = {
        tl: null, tc: null, tr: null,
        ml: null, mc: null, mr: null,
        bl: null, bc: null, br: null
    };

    this._sprite = null;
    this._bd = null;
    this._tmpBd = null;

    this.create();
};

ScaledImage.prototype = {
    create: function() {
        var c = this.bitmapData.context;

        this._bd = new Phaser.BitmapData(this.game,
                                         this.width, this.height);
        this._tmpBd = new Phaser.BitmapData(this.game, 1, 1);
        this._sprite = new Phaser.Sprite(this.game, 0, 0, this._bd);

        var xoff = this.bitmapData.width - this.right;
        var yoff = this.bitmapData.height - this.bottom;

        this.data.tl = c.getImageData(0, 0, this.left, this.top);
        this.data.tc = c.getImageData(this.left, 0,
                                      xoff - this.left, this.top);
        this.data.tr = c.getImageData(xoff, 0, this.right, this.top);

        this.data.ml = c.getImageData(0, this.top,
                                      this.left, yoff - this.top);
        this.data.mc = c.getImageData(this.left, this.top,
                                      xoff - this.left, yoff - this.top);
        this.data.mr = c.getImageData(xoff, this.top,
                                      this.right, yoff - this.top);

        this.data.bl = c.getImageData(0, yoff, this.left, this.bottom);
        this.data.bc = c.getImageData(this.left, yoff,
                                      xoff - this.left, this.bottom);
        this.data.br = c.getImageData(xoff, yoff,
                                      this.right, this.bottom);

        this.draw(this.width, this.height);
    },

    // call this with t,r,b,l params to resize on the fly
    draw: function(width, height) {
        this._bd.clear();
        var d = this.data;

        var mid_h = height - (this.top + this.bottom);
        var mid_w = width - (this.left + this.right);

        this.drawSlice(d.tl, 0, 0);
        this.drawSlice(d.tr, width - d.tr.width, 0);
        this.drawSlice(d.bl, 0, height - d.bl.height);
        this.drawSlice(d.br, width - d.br.width, height - d.br.height);

        this.drawRepeatedSlice(d.tc, this.left, 0, mid_w, this.top);
        this.drawRepeatedSlice(d.bc, this.left, height - this.bottom,
                               mid_w, this.bottom);
        this.drawRepeatedSlice(d.ml, 0, this.top, this.left, mid_h);
        this.drawRepeatedSlice(d.mc, this.left, this.top,
                               mid_w, mid_h);
        this.drawRepeatedSlice(d.mr, width - this.right, this.top,
                               this.right, mid_h);

        this._sprite.currentFrame = this._bd.textureFrame;
    },

    drawRepeatedSlice: function(imageData, x, y, width, height) {
        var d = imageData;
        var repeat_x = 1;
        var repeat_y = 1;
        if (width >= d.width) {
            repeat_x = Math.ceil(width / d.width);
        }
        if (height >= d.height) {
            repeat_y = Math.ceil(height / d.height);
        }
        var w = repeat_x * d.width;
        var h = repeat_y * d.height;
        this.clear(w, h);
        this._tmpBd.width = width;
        this._tmpBd.height = height;
        for (var yrow=0; yrow<repeat_y; yrow++) {
            var yoff = d.height * yrow;
            for (var xcol=0; xcol<repeat_x; xcol++) {
                var xoff = d.width * xcol;
                this._tmpBd.context.putImageData(d, xoff, yoff);
            }
        }
        this._bd.context.drawImage(this._tmpBd.canvas, x, y, width, height);
    },

    drawSlice: function(imageData, x, y, width, height) {
        var w = width || imageData.width;
        var h = height || imageData.height;
        this.clear(w, h);
        this._tmpBd.width = w;
        this._tmpBd.height = h;
        this._tmpBd.context.putImageData(imageData, 0, 0);
        this._bd.context.drawImage(this._tmpBd.canvas,
                                   x, y, w, h);
    },

    clear: function(w, h) {
        this._tmpBd.canvas.width = w;
        this._tmpBd.canvas.height = h;
        this._tmpBd.context.clearRect(0, 0, w, h);
    }
};

Object.defineProperty(ScaledImage.prototype, 'sprite', {
    get: function() {
        return this._sprite;
    }
});

// slice = {top:0, right:0, bottom:0, left:0}
module.exports.create = function(game, key, slice) {
    return new ScaledImage(game, key, slice);
}
