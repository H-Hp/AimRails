class UserController < ApplicationController
  def new_user
  end

  def regist_after
  end

  def mypage
    @username = params[:username] #URLからusernameを取得
    @user = User.find_by(user_name: @username) #ユーザーネームのデータ取得
    @email = @user.email
    @user_name = @user.user_name
    @encrypted_password = @user.encrypted_password

    @create_aim_count = Aim.where(user_id: @user.id).count
    @create_aims = Aim.where(user_id: @user.id)
  end

  def account_delete
  end
end
