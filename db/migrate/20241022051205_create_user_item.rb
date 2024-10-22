class CreateUserItem < ActiveRecord::Migration[6.1]
  def change
    create_table :user_items do |t|
      t.references :user, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.integer :quantity, default: 1
      t.datetime :acquired_at

      t.timestamps
    end
  end
end
