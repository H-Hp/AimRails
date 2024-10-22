class CreateGachas < ActiveRecord::Migration[6.1]
  def change
    create_table :gachas do |t|
      t.jsonb :weights, null: false, default: {}  # レアリティごとの重み
      t.jsonb :pickup, null: false, default: {}   # ピックアップキャラクターとその確率

      t.timestamps
    end
  end
end
