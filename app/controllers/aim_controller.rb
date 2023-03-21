class AimController < ApplicationController

  def new
    @aim = Aim.new
  end

  def create
    @aim = Aim.new(aim_params)
    if @aim.save
      # お問い合わせ内容が保存された場合の処理
      flash[:success] = '登録されました。'
      redirect_to new_aim_path
    else
      # お問い合わせ内容が保存されなかった場合の処理
      flash[:danger] = '正しく登録されませんでした。'
      render :new
    end
  end

  private

  def aim_params
    params.require(:aim).permit(:title, :content)
  end

  def aim
  end

  def edit
  end

  def search
  end
end
