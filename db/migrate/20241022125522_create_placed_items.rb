class CreatePlacedItems < ActiveRecord::Migration[6.1]
  def change
    create_table :placed_items do |t|
      t.references :user, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.integer :x_position, null: false
      t.integer :y_position, null: false
      t.integer :z_index, null: false
      t.integer :rotation, default: 0
      t.float :scale, default: 1.0
      t.boolean :active, default: true
      t.jsonb :properties, default: {}
  
      t.timestamps
    end

    # パフォーマンスのためのインデックス
    add_index :placed_items, :z_index
    add_index :placed_items, :active
  end
end
