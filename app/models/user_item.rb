class UserItem< ApplicationRecord
  belongs_to :user
  belongs_to :item
  
  validates :quantity, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :acquired_at, presence: true
end