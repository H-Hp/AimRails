# frozen_string_literal: true

class Users::ConfirmationsController < Devise::ConfirmationsController
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  # def create
  #   super
  # end

  # GET /resource/confirmation?confirmation_token=abcdef
  # def show
  #   super
  # end

   protected

  # 認証メールを再送信した後に使用されるパス。 The path used after resending confirmation instructions.
   def after_resending_confirmation_instructions_path_for(resource_name)
    super(resource_name)
    user_regist_after_path
    #sign_in(resource_name)# ユーザー登録が成功した後にログイン状態にする
   end

  # 確認後に使用されるパス。 The path used after confirmation.
   def after_confirmation_path_for(resource_name, resource)
     #super(resource_name, resource)
     #user_regist_after_path
     flash[:notice] = "メール認証が完了しました。"
     root_path
     #sign_in(resource)# ユーザー登録が成功した後にログイン状態にする
   end
end
