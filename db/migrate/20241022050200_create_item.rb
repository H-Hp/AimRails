class CreateItem < ActiveRecord::Migration[6.1]
  def change
    create_table :items do |t|
      t.bigint :gacha_id
      t.string :name, null: false
      t.string :item_type, null: false  # 背景(background)、desk(机)、Chara(キャラ)
      t.text :description          # アイテムの説明
      t.string :rarity            # レアリティ
      t.integer :max_quantity     # 最大保持可能数
      t.string :path              # 素材のパス
      t.jsonb :properties, default: {}  # キャラならframe_widthとframe_height

      t.timestamps
    end
  end
end
