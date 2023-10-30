class AddSendedIdAndUrlToTable < ActiveRecord::Migration[6.1]
  def change
    add_column :notifications, :sended_id, :integer
    add_column :notifications, :url, :string
  end
end
