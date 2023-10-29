class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|
      t.integer :user_id, null: false
      t.string :title, default: '', null: false
      t.string :body, default: '', null: false
      t.string :image_url, default: 'default', null: false
      t.string :action, default: '', null: false
      t.boolean :checked, default: false, null: false
      
      t.timestamps
    end
  end
end
