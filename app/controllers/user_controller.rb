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

  ##followerはフォローする人・followedはフォローされる人
  def follow
    follow_params=params.permit(:follower_id, :followed_id)
    relationship = Relationship.new(follow_params)
    if relationship.save
      #redirect_to aim
      redirect_back(fallback_location: root_path)#リファラが利用できない場合にはルートパス（root_path）にリダイレクト
    else
      flash[:danger] = 'フォローできませんでした。'
      redirect_to aim
    end
  end
  def follow_delete
    follow_params=params.permit(:follower_id, :followed_id)
    relationship = Relationship.where(follow_params).first
    if relationship.destroy
      # 送信元のビューにリダイレクト
      redirect_back(fallback_location: root_path)#リファラが利用できない場合にはルートパス（root_path）にリダイレクト
    else
      flash[:danger] = 'フォローを外すことができませんでした'
      redirect_to aim
    end
  end

end
