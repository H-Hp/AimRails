class Item < ApplicationRecord
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
end