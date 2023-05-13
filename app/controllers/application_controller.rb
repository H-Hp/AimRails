class ApplicationController < ActionController::Base
  before_action :set_cors_headers
	def top
		render html: "Top hello, world!"
	end


  private

  def set_cors_headers
    response.set_header('Access-Control-Allow-Origin', 'd2hcwuo8gsf97u.cloudfront.net')
		#response.set_header('Access-Control-Allow-Origin', 'http://0.0.0.0:3000')
    response.set_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.set_header('Access-Control-Allow-Headers', 'Content-Type')
  end
end
