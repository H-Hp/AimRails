class NotificationsController < ApplicationController
  def index
  end
  def new
    @notifications = Notification.new
  end
  
  def create
    #user_id = params[:user_id]
    user_id = notification_params[:user_id]
    #binding.pry #デバッガ有効
    #if user_id == "all"
    if user_id != "all"#user_idがallじゃない=user_idがあるので個別送信
      #binding.pry #デバッガ有効
      @notifications = Notification.new(notification_params)
      #@notifications = Notification.create(user_id:3, sended_id:1, title:"値1", url:"値1", image_url:"値1", action:"値1")
      if @notifications.save
        redirect_to root_path
      end
    else #user_idがnil=全体送信
      @users = User.all
      #binding.pry #デバッガ有効
      #notification_params = params.require(:notification).permit(:user_id)#user_idを除外
  
      
      @users.each do |user|
        notification_params =params.require(:notification).permit(:sended_id, :title, :url, :image_url, :action).merge(user_id: user.id)

        #notification_params..merge(user_id: user.id)
        #notification_params[:user_id] = user.id
        #notification_params.user_id= user.id
        #binding.pry
        @notifications = Notification.new(notification_params)
        #@notification.user_id =user.id
        @notifications.save
      end
      redirect_to root_path
    end
  end

  def check
    #@notifications = Notification.new
    #@notifications = Notification.find(user_id: current_user.id)
    @notifications = Notification.where(user_id: current_user.id)
    #@aim = Aim.find_by(id: params[:id])
    @notifications.update(checked: true)
    @nocheck_notification_count =0 #全部確認済みに変更
  end

  def delete
    notification = Notification.find(params[:id])
    notification.destroy
    redirect_to notifications_path
  end

  private

  def notification_params
    #params.require(:aim).permit(:title, :content)
    #params.require(:notifications).permit(:user_id, :sended_id, :title, :url, :image_url, :action, :checked)
    params.require(:notification).permit(:user_id, :sended_id, :title, :url, :image_url, :action)

  end
end
