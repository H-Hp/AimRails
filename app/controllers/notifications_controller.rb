class NotificationsController < ApplicationController
  def index
  end
  def new
    @notifications = Notification.new
  end
  
  def create
    @notifications = Notification.new(notification_params)
    #@notifications = Notification.create(user_id:3, sended_id:1, title:"値1", url:"値1", image_url:"値1", action:"値1")
    if @notifications.save
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

  private

  def notification_params
    #params.require(:aim).permit(:title, :content)
    #params.require(:notifications).permit(:user_id, :sended_id, :title, :url, :image_url, :action, :checked)
    params.require(:notification).permit(:user_id, :sended_id, :title, :url, :image_url, :action)

  end
end
