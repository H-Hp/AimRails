class RemoveUpdatedAtFromNotifications < ActiveRecord::Migration[6.1]
  def change
    remove_column :notifications, :updated_at, :datetime
  end
end
