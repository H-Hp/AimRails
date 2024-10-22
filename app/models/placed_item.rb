class PlacedItem < ApplicationRecord
  belongs_to :user
  belongs_to :item

  validates :x_position, presence: true, numericality: { only_integer: true }
  validates :y_position, presence: true, numericality: { only_integer: true }
  validates :z_index, presence: true, numericality: { only_integer: true }
  validates :rotation, numericality: { only_integer: true }
  validates :scale, numericality: true
  validates :active, inclusion: { in: [true, false] }

  # オブジェクトの位置を更新するスコープ
  scope :active_items, -> { where(active: true) }
  scope :by_z_index, -> { order(z_index: :asc) }

  # 位置を更新するメソッド
  def update_position(x: nil, y: nil, z: nil)
    updates = {}
    updates[:x_position] = x unless x.nil?
    updates[:y_position] = y unless y.nil?
    updates[:z_index] = z unless z.nil?
    update(updates)
  end

  # 回転と拡大縮小を更新するメソッド
  def update_transform(rotation: nil, scale: nil)
    updates = {}
    updates[:rotation] = rotation unless rotation.nil?
    updates[:scale] = scale unless scale.nil?
    update(updates)
  end
end
