class Aim < ApplicationRecord
  has_many :likes
  has_one_attached :aim_thumb_img
end
