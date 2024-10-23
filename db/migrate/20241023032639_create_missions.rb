class CreateMissions < ActiveRecord::Migration[6.1]
  def change
    create_table :missions do |t|
      t.string :name, null: false
      t.string :description
      t.string :mission_type, null: false
      t.integer :required_amount, null: false
      t.integer :reset_frequency, default: 0  # 0: never, 1: daily, 7: weekly, etc.
    
      t.timestamps
    end
  end
end
