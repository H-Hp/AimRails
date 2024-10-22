class CreateAimRooms < ActiveRecord::Migration[6.1]
  def change
    create_table :aim_rooms do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :currency, default: 0
      t.datetime :last_login_at
      t.integer :total_login_days, default: 0
      t.integer :total_gacha_rolls, default: 0
      t.integer :daily_play_time, default: 0
    
      t.timestamps
    end
  end
end
