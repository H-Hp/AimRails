require 'rake'

class AimController < ApplicationController
  protect_from_forgery #AjaxのCSRF対策回避

  def new
    @aim = Aim.new
  end

  def create
    @aim = Aim.new(aim_params)
    if @aim.save
      #Rake::Task["sitemap:create"].invoke #sitemapを更新
      # お問い合わせ内容が保存された場合の処理
      flash[:success] = '登録されました。'
      #redirect_to new_aim_path
      #redirect_to root_path
      redirect_to @aim
    else
      # お問い合わせ内容が保存されなかった場合の処理
      flash[:danger] = '正しく登録されませんでした。'
      render :new
    end
  end

  def aim
    @aim = Aim.find_by(id: params[:id])
    @author_id =@aim.user_id
    @author = User.find_by(id: @author_id)
  end

  def edit
    @aim = Aim.find_by(id: params[:id])
  end

  def update
    
    @aim = Aim.find(params[:id])
    #@aim = Aim.find_by(id: params[:id])
    if @aim.update(aim_params)
      #サムネのアップロード
      params.permit(:aim_thumb_img) 
      #if @aim.aim_thumb_img.attach(io: params[:aim_thumb_img], filename: "aim_thumb_"+@aim.id.to_s)
      #@user.user_icon_image.attach key: "user_icon/#{@user.id.to_s}", io: params[:user_icon_image], filename: "#{@user.id.to_s}"
      if @aim.aim_thumb_img.attach key: "aim_thumb/#{@aim.id.to_s}", io: params[:aim_thumb_img], filename: "#{@aim.id.to_s}"

        redirect_to @aim
      else
        render 'edit'
      end
    else
      render 'edit'
    end
  end

  def search
    @aim = Aim.where('title LIKE ?', "%#{params[:word]}%")
  end

  def delete
    aim = Aim.find(params[:id])
    aim.destroy
    likes = Like.where(aim_id: aim.id)
    likes.destroy_all
    #Rake::Task["sitemap:create"].invoke #sitemapを更新
    #redirect_to root_path
    if request.referer&.include?("/edit")
      redirect_to root_path
    elsif request.referer&.include?("/mypage") 
      redirect_to mypage_path
    end
  end

  def like
    like_params=params.permit(:user_id, :aim_id)
    aim=Aim.find(params[:aim_id])
    @like = Like.new(like_params)
    if @like.save
      redirect_to aim
    else
      # お問い合わせ内容が保存されなかった場合の処理
      flash[:danger] = 'いいねできませんでした。'
      redirect_to aim
    end
  end
  def like_delete
    like_params=params.permit(:user_id, :aim_id)
    aim=Aim.find(params[:aim_id])
    #like = Like.find(like_params)
    #like = Like.find(params[:id])
    like = Like.where(user_id: params[:user_id], aim_id: params[:aim_id]).first
    if like.destroy
      #redirect_to aim
      # 送信元のビューにリダイレクト
      redirect_back(fallback_location: root_path)#リファラが利用できない場合にはルートパス（root_path）にリダイレクト
    else
      # お問い合わせ内容が保存されなかった場合の処理
      flash[:danger] = 'いいねを取り消しできませんでした'
      redirect_to aim
    end
  end


  private

  def aim_params
    #params.require(:aim).permit(:title, :content)
    #params.require(:aim).permit(:title, :content).merge(user_id: current_user.id,image_url: "default")
    params.permit(:title, :content).merge(user_id: current_user.id,image_url: "default")

  end
  
end
