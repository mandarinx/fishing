"use strict";

var image = {
    sprite: undefined,
    items: undefined,
    name: '',

    init: function(game) {},

    setSlot: function(slot, coordinate) {
        if (typeof slot === 'undefined') {
            this.hide();
        } else {
            this.name = slot.name;
            this.items = slot.list.length;
            this.sprite = slot.sprite;
            this.show(coordinate);
        }
    },

    show: function(coordinate) {
        if (typeof this.sprite !== 'undefined') {
            this.sprite.x = coordinate.x + (this.sprite.width * this.sprite.anchor.x);
            this.sprite.y = coordinate.y + (this.sprite.height * this.sprite.anchor.y);
            this.sprite.visible = true;
        }
    },

    hide: function() {
        if (typeof this.sprite !== 'undefined') {
            this.sprite.visible = false;
        }
    }
};

module.exports.create = function(game) {
    var instance = Object.create(image);
    instance.init(game);
    return instance;
}
