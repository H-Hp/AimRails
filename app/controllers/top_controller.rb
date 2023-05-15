class TopController < ApplicationController
  def top
    @aim = Aim.all
    if user_signed_in?
      # ログイン中の場合の処理
      @login_or_out = 'ログイン中'
    else
      # ログインしていない場合の処理
      @login_or_out = 'ログアウト中'
    end

  end
end
