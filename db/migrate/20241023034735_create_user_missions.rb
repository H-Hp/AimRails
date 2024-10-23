class CreateUserMissions < ActiveRecord::Migration[6.1]
  def change
    create_table :user_missions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :mission, null: false, foreign_key: true
      t.integer :progress, default: 0
      t.boolean :completed, default: false
      t.boolean :rewarded, default: false
      t.datetime :last_reset_at
    
      t.timestamps
    end
  end
end
