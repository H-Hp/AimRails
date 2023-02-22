class ApplicationController < ActionController::Base
  def top
		render html: "Top hello, world!"
	end
end
