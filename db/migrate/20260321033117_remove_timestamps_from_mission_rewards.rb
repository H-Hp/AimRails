class RemoveTimestampsFromMissionRewards < ActiveRecord::Migration[6.1]
  def change
    remove_column :mission_rewards, :created_at, :datetime
		remove_column :mission_rewards, :updated_at, :datetime
  end
end
