require 'bcrypt'
require 'digest/md5'
class SettingController < ApplicationController
  def setting_page
    @user = current_user
    @email = @user.email
    @user_name= @user.user_name
    #@email = current_user.email
    #@encrypted_password = @user.encrypted_password

    email = 'stepjump3333@yahoo.co.jp'
    @hashed_email = Digest::MD5.hexdigest(email)
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
      redirect_to setting_path, notice: "エラーが発生しました"
    end
  end

  def update_username
    user = User.find(params[:id])
    if user.update(user_name: params[:user_name])
      redirect_to setting_path
    else
      redirect_to setting_path, notice: "エラーが発生しました"
    end
  end

  def update_password
    user = User.find(params[:id])
    #user.reset_password("aaaaaa", "aaaaaa")
    #もしかしたら暗号化しないといけないかもnew_password=params[:new-password]
    old_password = params[:old_password]
    new_password = params[:new_password]
    password_confirmation = params[:password_confirmation]
    
    if new_password == password_confirmation
        #input_old_encrypted_password = BCrypt::Password.create(new_password)
        #binding.pry #デバッガ有効
        #if input_old_encrypted_password == @encrypted_password
        if current_user.valid_password?(old_password)
              if user.reset_password(new_password, new_password)
                #if user.update_with_password(password_params)
                  #bypass_sign_in(current_user) # ログイン状態を維持
                  sign_in(user, bypass: true)# ログイン状態を維持 # パスワードが正常にリセットされた場合に再認証する
                  #redirect_to root_path, notice: "パスワードが更新されました。"
                  redirect_to setting_path, notice: "パスワードが更新されました。"
                else
                  redirect_to setting_path, notice: "エラーが起きました"
                end
          else
            redirect_to setting_path, notice: "現在のパスワードが間違っています"
          end
    else
      redirect_to setting_path, notice: "確認用パスワードが一致しません"
    end
    
  end
    #@old_password = params[:current_password]
    #@new_password = params[:password]
    
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
  


  def custom_img
  
  end

  def upload_img
    #user_id=params[:id]
    #ストレージに画像をアップロード
    #file = params[:user][:image]
    #@user.image.attach(io: file, filename: 'image.jpg')# ストレージにアップロード
    @user = User.find(params[:id])

    # ストロングパラメータ
    #params.require(:user).permit(:user_icon_image)
    #params.require(:setting).permit(:user_icon_image) 
    params.permit(:user_icon_image) 
    
    # アタッチ
    #@user.user_icon_image.attach(params[:user][:user_icon_image])
    @user.user_icon_image.attach(io: params[:user_icon_image], filename: "test_file_name")

    if @user.save
      redirect_to root_path
    end
  end
  
  def delete_user
    user = User.find(params[:id])
    user.destroy   
    redirect_to root_path
  end

  private
    def user_icon_image_params
      params.require(:user).permit(:user_icon_image)
    end

    #def password_params
    #  params.require(:user).permit(:password, :password_confirmation, :current_password)
    #end
end
