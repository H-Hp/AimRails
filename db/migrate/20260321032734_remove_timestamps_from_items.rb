class RemoveTimestampsFromItems < ActiveRecord::Migration[6.1]
  def change
    remove_column :items, :created_at, :datetime
    remove_column :items, :updated_at, :datetime
  end
end
