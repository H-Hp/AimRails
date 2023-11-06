class AddUsernameToTable < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_name, :varchar, limit: 30
  end
end
