class CreateMissionRewards < ActiveRecord::Migration[6.1]
  def change
    create_table :mission_rewards do |t|
      t.references :mission, null: false, foreign_key: true
      t.integer :threshold
      t.integer :currency_amount
    
      t.timestamps
    end
  end
end
