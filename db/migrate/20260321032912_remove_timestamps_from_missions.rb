class RemoveTimestampsFromMissions < ActiveRecord::Migration[6.1]
  def change
    remove_column :missions, :created_at, :datetime
		remove_column :missions, :updated_at, :datetime
  end
end
