class Mission < ApplicationRecord
  has_many :user_missions
  has_many :mission_rewards
end
