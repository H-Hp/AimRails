class RemoveBodyFromYourTable < ActiveRecord::Migration[6.1]
  def change
    remove_column :notifications, :body, :string
  end
end
