# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

 protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # サインアップ後に使用されるパス。The path used after sign up.
   def after_sign_up_path_for(resource)
     #super(resource)
     user_regist_after_path
     #sign_in(resource)# ユーザー登録が成功した後にログイン状態にする
   end

  # 非アクティブなアカウントのサインアップ後に使用されるパス。The path used after sign up for inactive accounts.
   def after_inactive_sign_up_path_for(resource)
     #super(resource)
     user_id = resource.id
     @notifications = Notification.new
     #@notifications = Notification.create(user_id:current_user.id, sended_id:1, title:"【登録完了のお知らせ】アカウントを作成いただき、誠にありがとうございます。私たちのコミュニティへようこそ！", url:"/", image_url:"default", action:"signup")
     @notifications = Notification.create(user_id:user_id, sended_id:1, title:"【登録完了のお知らせ】アカウントを作成いただき、誠にありがとうございます。私たちのコミュニティへようこそ！", url:"/", image_url:"default", action:"signup")
     @notifications.save
     user_regist_after_path
     #sign_in(resource)# ユーザー登録が成功した後にログイン状態にする
   end
end
