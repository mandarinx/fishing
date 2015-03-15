"use strict";

var events          = require('events');
var type            = require('utils/type');

var slots = [];

// [
//     {
//         name: 'Leather boot',
//         sprite: this.list[0].sprite,
//         list: [{loot}, {loot}]
//     }
// ]

var inventory = {
    init: function() {
        events.onLootDrop.add(onLootDrop);
    }
};

module.exports = inventory;

function onLootDrop(loot) {
    var slot = getSlot(loot.settings.name);
    addItem(loot, slot);

    console.log(slots);
}

function addItem(loot, slot) {
    if (type(slot).is_undefined) {
        slots.push({
            name:   loot.settings.name,
            list:   [loot]
        });

        slots[slots.length-1].sprite = slots[slots.length-1].list[0].sprite;
        return;
    }

    slot.list.push(loot);
}

function getSlot(item_name) {
    var slot;
    for (var i=0; i<slots.length; i++) {
        slot = slots[i];
        if (slot.name === item_name) {
            break;
        }
    }
    return slot;
}
