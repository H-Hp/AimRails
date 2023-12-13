class SitemapsController < ApplicationController
  def index
    @domain = "#{request.protocol}#{request.host}"
    @aims = Aim.all
    @latest_aim_createdAt = Aim.order(created_at: :desc).first.created_at.in_time_zone("Tokyo").iso8601
    @latest_play_chat_created = Play.order(created_at: :desc).first.created_at.in_time_zone("Tokyo").iso8601
    #render xml: @aims,@domain
    #render xml: { aims: @aims, domain: @domain }
   
    respond_to do |format|
      format.xml
    end

=begin
=end
  end
end