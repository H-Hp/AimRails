class RemoveUpdatedAtFromLikes < ActiveRecord::Migration[6.1]
  def change
    remove_column :likes, :updated_at, :datetime
  end
end
