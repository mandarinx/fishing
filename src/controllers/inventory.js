"use strict";

var events          = require('events');
var type            = require('utils/type');
var input           = require('controllers/input');
var ui              = require('ui/ui_manager');

var slots = [];
var game;
var max_slots = 32;

var inventory = {
    init: function(g) {
        game = g;
        events.onLootDrop.add(onLootDrop);
        input.inventory.onUp.add(toggleInventoryUI);
    }
};

module.exports = inventory;

function onLootDrop(loot) {
    addItem(loot, getSlot(loot.settings.name));
    // console.log(slots);
}

function addItem(loot, slot) {
    if (type(slot).is_undefined) {
        if (slots.length >= max_slots) {
            return;
        }

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

function toggleInventoryUI() {
    ui.toggle('inventory', slots);
}
