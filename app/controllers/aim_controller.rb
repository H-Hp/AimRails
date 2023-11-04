class AimController < ApplicationController

  def new
    @aim = Aim.new
  end

  def create

    @aim = Aim.new(aim_params)
    if @aim.save
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
  end

  def edit
    @aim = Aim.find_by(id: params[:id])
  end

  def update
    @aim = Aim.find(params[:id])
    #@aim = Aim.find_by(id: params[:id])
    if @aim.update(aim_params)
      #redirect_to @aim
      #redirect_to new_aim_path
      redirect_to @aim
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
    #redirect_to root_path
    if request.referer&.include?("/edit")
      redirect_to root_path
    elsif request.referer&.include?("/mypage") 
      redirect_to mypage_path
    end
  end


  private

  def aim_params
    #params.require(:aim).permit(:title, :content)
    params.require(:aim).permit(:title, :content).merge(user_id: current_user.id,image_url: "default")
  end
  
end
