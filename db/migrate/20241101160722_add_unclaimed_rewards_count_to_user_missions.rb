class AddUnclaimedRewardsCountToUserMissions < ActiveRecord::Migration[6.1]
  def change
    add_column :user_missions, :unclaimed_rewards_count, :integer, default: 0
  end
end
