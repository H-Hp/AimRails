class UserController < ApplicationController
  protect_from_forgery #AjaxのCSRF対策回避
  
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
    @follow_user = User.find_by(id: params[:follower_id])#フォローボタンを押したユーザー
    if relationship.save
      # 通知を作成・再度送られないように・aimの作成者が通知を消してなければ送信
      unless Notification.exists?(user_id: params[:followed_id], title: "#{@follow_user.user_name}にフォローされました。")
        Notification.create(user_id: params[:followed_id], sended_id: params[:follower_id], title: "#{@follow_user.user_name}にフォローされました。",url:"/", image_url:"default",action: 'follow')
      end
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
