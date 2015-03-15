"use strict";

var events          = require('events');
var type            = require('utils/type');

var slots = [];

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
        var i = slots.push({
            name:   loot.settings.name,
            list:   [loot]
        });

        slots[i-1].sprite = slots[i-1].list[0].sprite;
        return;
    }

    slot.list.push(loot);
}

function getSlot(item_name) {
    var slot;
    for (var i=0; i<slots.length; i++) {
        if (slots[i].name === item_name) {
            slot = slots[i];
            break;
        }
    }
    return slot;
}
