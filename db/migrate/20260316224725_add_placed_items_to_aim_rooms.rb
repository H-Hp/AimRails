class AddPlacedItemsToAimRooms < ActiveRecord::Migration[6.1]
  def change
    #add_column :aim_rooms, :placed_items, :jsonb
    add_column :aim_rooms, :placed_items, :jsonb, default: {
      bg: "bg0",
      chara: "chara0",
      desk: "desk0",
      board: "board0",
      picture: "picture0",
      obj: "obj2"
    }, null: false
  end
end
