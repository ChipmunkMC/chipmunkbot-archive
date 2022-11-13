function bot (bot) {
  function setInventorySlot (slot, item) {
    bot._client.write('set_creative_slot', { slot, item })
  }
  bot.setInventorySlot = setInventorySlot
}

function client (bot) {
  bot.inventory = new Array(46).fill({ present: false })
  // TODO: Hotbar slots

  bot._client.on('set_slot', ({ windowId, slot, item }) => {
    if (windowId !== 0) return // Ignore non-inventory set_slot packets
    
    bot.inventory[slot] = { ...defaultItem, ...clean(item) } // set the slot
  })
  bot._client.on('window_items', ({ windowId, items }) => {
    if (windowId !== 0) return // Ignore non-inventory window_items packets

    items.forEach((item, slot) => {
      bot.inventory[slot] = { ...defaultItem, ...clean(item) } // set the slot
    })
  })
}