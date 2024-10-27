class Item < ApplicationRecord
  has_many :user_items
  has_many :users, through: :user_items
  
  validates :name, presence: true
  validates :item_type, presence: true
  
  # typeカラムの値を制限する場合
  validates :item_type, inclusion: { in: ['background', 'desk', 'Chara'] }
  
  # propertiesのバリデーション（キャラの場合）
  validate :validate_chara_properties
  
  private
  
  def validate_chara_properties
    if item_type == 'Chara'
      if properties.present?
        unless properties['frame_width'].present? && properties['frame_height'].present?
          errors.add(:properties, 'must include frame_width and frame_height for Chara type')
        end
      end
    end
  end

  scope :formatted_for_master, -> {
    select(:id, :gacha_id, :name, :item_type, :description, :rarity, :max_quantity, :path)
      .map do |item|
        {
          id: item.id,
          gacha_id: item.gacha_id,
          name: item.name,
          type: item.item_type,
          description: item.description,
          rarity: item.rarity,
          max_quantity: item.max_quantity,
          path: item.path
        }
      end
  }
end