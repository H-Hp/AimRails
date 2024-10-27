class Gacha < ApplicationRecord
  validates :weights, presence: true
  validates :pickup, presence: true
  
  validate :validate_weights_format
  validate :validate_pickup_format

  validates :name, presence: true
  validates :description, presence: true
  validates :cost, presence: true, numericality: { greater_than_or_equal_to: 0 }


  def formatted_weights
    weights.map { |weight| weight.map(&:to_f) }
  end

  def formatted_pickup
    pickup.map { |item| [item[0].to_i, item[1].to_f] }
  end
  
  private

  def validate_weights_format
    return unless weights.present?
    
    unless weights.is_a?(Array) && weights.all? { |w| w.is_a?(Array) && w.length == 2 }
      errors.add(:weights, 'must be an array of [rarity, probability] pairs')
    end
  end
end