class Gacha < ApplicationRecord
  validates :weights, presence: true
  validates :pickup, presence: true
  
  validate :validate_weights_format
  validate :validate_pickup_format

  private

  def validate_weights_format
    return unless weights.present?
    
    unless weights.is_a?(Array) && weights.all? { |w| w.is_a?(Array) && w.length == 2 }
      errors.add(:weights, 'must be an array of [rarity, probability] pairs')
    end
  end