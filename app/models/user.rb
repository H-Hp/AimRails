class User < ApplicationRecord
  has_one_attached :user_icon_image
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  #devise :database_authenticatable, :registerable,
  #       :recoverable, :rememberable, :validatable, :confirmable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end
