class UserController < ApplicationController
  def new_user
  end

  def regist_after
  end

  def mypage
    @user = current_user
    @email = @user.email
    @encrypted_password = @user.encrypted_password
  end

  def account_delete
  end
end
