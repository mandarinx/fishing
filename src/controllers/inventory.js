"use strict";

var events          = require('events');
var type            = require('utils/type');
var input           = require('controllers/input');
var ui              = require('ui/ui_manager');

var slots = [];
var game;
var max_slots = 32;
// var num_slots_v = 8;
// var ui_panel;

var inventory = {
    init: function(g) {
        game = g;
        events.onLootDrop.add(onLootDrop);
        // ui_panel = game.add.group();
        // ui_panel.visible = false;
        input.inventory.onUp.add(toggleInventoryUI);
    }
};

module.exports = inventory;

function onLootDrop(loot) {
    addItem(loot, getSlot(loot.settings.name));
    console.log(slots);
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
    // TODO: Inventory should pass the slots array to ui manager, and
    // let ui manager handle showing/hiding of the inventory panel
    ui.toggle('inventory', slots);
    // if (ui_panel.visible) {
    //     hide();
    // } else {
    //     show();
    // }
}

// function hide() {
//     console.log('hide inventory');
//     ui_panel.callAll('destroy');
//     ui_panel.visible = false;
// }

// function show() {
//     console.log('show inventory');
//     var x = 0;
//     var y = 0;

//     slots.forEach(function(slot, i) {
//         var slot_ui = game.add.sprite(x, y, 'sprites-16');
//         slot_ui.frame = slot.sprite.frame;
//         ui_panel.add(slot_ui);

//         var label = game.add.bitmapText(x + 32, y, 'Gamegirl', slot.name, 16);
//         ui_panel.add(label);

//         y += 16;
//         if (i > 0 && i % num_slots_v === 0) {
//             y = 0;
//             x = 256;
//         }
//     });

//     ui_panel.visible = true;
// }
