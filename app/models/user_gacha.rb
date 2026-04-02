class UserGacha< ApplicationRecord
  belongs_to :user
  belongs_to :item
  belongs_to :gacha
  
  validates :acquired_at, presence: true
end