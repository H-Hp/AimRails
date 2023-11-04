require 'bcrypt'

class SettingController < ApplicationController
  def setting_page
    @user = current_user
    @email = @user.email
    @encrypted_password = @user.encrypted_password

    resource = current_user
    resource_name = "user"
  end
  def update_mail
    user = User.find(params[:id])
    #if @user.update(email_params)
    #if user.update(email: params[:user][:email])
    #if user.update(email: params[:id][:email])
    if user.update(email: params[:email])
      #redirect_to @aim
      #redirect_to root_path
      redirect_to setting_path
    else
      render 'edit'
    end
  end
  def update_password
    user = User.find(params[:id])
    user.reset_password("aaaaaa", "aaaaaa")

    #もしかしたら暗号化しないといけないかもnew_password=params[:new-password]
    @old_password = params[:old_password]
    @new_password = params[:new_password]
    binding.pry #デバッガ有効
    #@old_password = params[:current_password]
    #@new_password = params[:password]
    @input_old_encrypted_password = BCrypt::Password.create(@new_password)
    if @input_old_encrypted_password == @encrypted_password
      # ストロングパラメーター 
     #user_params = {
     #  current_password: @old_password,
     #   password: @new_password, 
     #   password_confirmation: @new_password
      #}
      #encrypted_password = BCrypt::Password.create(@new_password)
      #encrypted_password = user.encrypt(password) 
      #encrypted_password = password_digest(@password) 
      #if user.update(encrypted_password: new_password)
      #if user.update(encrypted_password: params[:new-password])
      #if user.update(password: params[:new-password])
      #if user.update(encrypted_password: encrypted_password)
      #if user.update_with_password(current_password: @old_password, password: @new_password, password_confirmation: @new_password)
      #if @user.update_with_password(user_params)
      #if user.update_with_password(password: @new_password, password_confirmation: @new_password, current_password: @old_password)
      #user.update_with_password(current_password: @old_password, password: @new_password, password_confirmation: @new_password)
      
      #user.password = @new_password
      #user.password_confirmation = @new_password
      #if user.save

      #User.find(id).reset_password(password, password)
      if user.reset_password(@new_password, @new_password)
      #if user.update_with_password(password_params)
        bypass_sign_in(current_user) # ログイン状態を維持
        #redirect_to root_path, notice: "パスワードが更新されました。"
        redirect_to setting_path, notice: "パスワードが更新されました。#{@old_password} #{@new_password}"
      else
        redirect_to mypage_path
      end

    else
      redirect_to root_path
    end

  end

  def delete_user
    user = User.find(params[:id])
    user.destroy   
    redirect_to root_path
  end

  private

    #def password_params
    #  params.require(:user).permit(:password, :password_confirmation, :current_password)
    #end
end
