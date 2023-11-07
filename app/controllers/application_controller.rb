require 'net/http'
require 'uri'
require 'json'

class ApplicationController < ActionController::Base
  before_action :set_cors_headers

  before_action :set_init, if: :user_signed_in?

  before_action :configure_permitted_parameters, if: :devise_controller?

  def set_init
    #@notifications = Notification.find_by(user_id: current_user.id)
    @notifications = Notification.where(user_id: current_user.id) #通知を取得して変数に入れて他のコントローラーでも使えるように
    @nocheck_notification_count = Notification.where(user_id: current_user.id,checked: false).count
    
    #time = Time.parse(aim.updated_at.to_s)
    #time_jst = time.in_time_zone('Tokyo')
    #@notifications_formatted_time = time_jst.strftime('%Y年%m月%d日')
    
    
    @current_user_id=current_user.id
    @current_email=current_user.email

    #ユーザーランキング
    #Aimモデルから最もユーザー数が多いデータ(記事の作成数が多い順でランキング)を10個取得
    duplicated_user_id = Aim.group(:user_id).having('count(user_id) > 1').pluck(:user_id)
    #@users_with_duplicated_names = User.where(user_id: duplicated_user_id).limit(10)
    @users_with_duplicated_names = User.where(id: duplicated_user_id).limit(10)
    
    #
    #duplicated_usernames_count = Aim.group(:user_name).having('count(user_name) > 1').count

  end

  PUSHCODE_API_KEY="bf423538549f5ef9cda811050cb82eba2af9dcf7732e708234fa15f87e094298"
  PUSHCODE_endpoint="https://api.pushcode.jp/v1/push/af9db06579f5de5aa32a5c165d269c2f69e0fc0cae45b607993edbb28d45b37d"
	def top
    payload = {when: {immediate: true}}.to_json
    response = Faraday.post PUSHCODE_endpoint do |req|
      req.headers['Content-Type'] = 'application/json'
      req.headers['X-PUSHCODE-APIKEY'] = PUSHCODE_API_KEY  
      req.body = payload 
    end

=begin  
    uri = URI.parse(PUSHCODE_endpoint)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Get.new(uri.request_uri)
    request["Authorization"] = PUSHCODE_API_KEY

    response = http.request(request)
    @pushes="1"
    if response.code == "200"
      @pushes = JSON.parse(response.body)
      # プッシュ通知リストを処理する
    else
      @pushes ="error:#{response.code}"
      puts "Error: #{response.code}"
    end


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
=end
    render html: "Top hello, world!"
	end


  def index
   
    
    
  end


  private

  def user_signed_in?
    # ログイン済みか判定するメソッド
    current_user.present? 
  end

  def set_cors_headers
    response.set_header('Access-Control-Allow-Origin', 'd2hcwuo8gsf97u.cloudfront.net')
		#response.set_header('Access-Control-Allow-Origin', 'http://0.0.0.0:3000')
    response.set_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.set_header('Access-Control-Allow-Headers', 'Content-Type')
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:user_name])
  end
end
