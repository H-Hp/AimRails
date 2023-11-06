class AddIconUrlToUser < ActiveRecord::Migration[6.1]
  def change
    #add_column :users, :icon_url, :text
    add_column :users, :icon_url, :string, default: 'default'
  end
end
