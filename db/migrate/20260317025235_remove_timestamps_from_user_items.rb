class RemoveTimestampsFromUserItems < ActiveRecord::Migration[6.1]
  def change
    remove_column :user_items, :created_at, :datetime
		remove_column :user_items, :updated_at, :datetime
  end
end
