class TopController < ApplicationController
  def top
    @aim = Aim.all
  end
end
