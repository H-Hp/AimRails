class AimRoomController < ApplicationController

  def index
  end

  def check_login_status
    data = 'login'
    #data = 'logout'
    if data == 'logout'
      render json: { logged_in: false }
    elsif data == 'login'
      render json: { logged_in: true }
    end
  end

end
