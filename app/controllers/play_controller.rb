class PlayController < ApplicationController
  def index
    @plays =Play.all.limit(50)
  end
  def post
    play = Play.new(message: params[:message])
    if play.save
      redirect_to play_path
    else
      redirect_to play_path, notice: "エラーが発生しました"
    end
  end
end
