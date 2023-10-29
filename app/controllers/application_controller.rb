class ApplicationController < ActionController::Base
  before_action :set_cors_headers

  PUSHCODE_API_KEY = "bf423538549f5ef9cda811050cb82eba2af9dcf7732e708234fa15f87e094298"

	def top
		render html: "Top hello, world!"
    
    url = "http://example.com/api"
    response = `curl \
    -H 'X-PUSHCODE-APIKEY: #{PUSHCODE_API_KEY}' \
    'https://api.pushcode.jp/v1/push/list'` 
    @result = JSON.parse(response)

    #response = Excon.get(
      #"https://api.pushcode.jp/v1/push/{api_token}"
      #"https://api.pushcode.jp/v1/push/{"+PUSHCODE_API_KEY+"}"
      #"https://api.pushcode.com/api/v1/push",
      #"https://api.pushcode.jp/v1/push/list",
      #"https://api.pushcode.jp/v1/push/af9db06579f5de5aa32a5c165d269c2f69e0fc0cae45b607993edbb28d45b37d",
    #  query: {api_key: PUSHCODE_API_KEY}
   # )

    @pushes = JSON.parse(response.body)["pushes"]
	end


  def index
   
    
    
  end


  private

  def set_cors_headers
    response.set_header('Access-Control-Allow-Origin', 'd2hcwuo8gsf97u.cloudfront.net')
		#response.set_header('Access-Control-Allow-Origin', 'http://0.0.0.0:3000')
    response.set_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.set_header('Access-Control-Allow-Headers', 'Content-Type')
  end
end
