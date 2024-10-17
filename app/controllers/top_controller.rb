require 'net/http'
require 'uri'
require 'json'

class TopController < ApplicationController
  PUSHCODE_API_KEY="bf423538549f5ef9cda811050cb82eba2af9dcf7732e708234fa15f87e094298"
  PUSHCODE_endpoint="https://api.pushcode.jp/v1/push/af9db06579f5de5aa32a5c165d269c2f69e0fc0cae45b607993edbb28d45b37d"

  def top



=begin     
    response = `curl -H 'X-PUSHCODE-APIKEY: #{PUSHCODE_API_KEY}' 'https://api.pushcode.jp/v1/push/list'`
    #response = `curl -H 'X-PUSHCODE-APIKEY: #{@PUSHCODE_API_KEY}' {@PUSHCODE_endpoint}`
    @response = Nokogiri::HTML(response)

    #response = `curl -H 'Content-type: application/json' -H 'X-PUSHCODE-APIKEY: #{@PUSHCODE_API_KEY}' -d '{ "when": { "immediate": true } }' #{@PUSHCODE_endpoint}`
    response = `curl \
    -H 'Content-type: application/json' \
    -H 'X-PUSHCODE-APIKEY: bf423538549f5ef9cda811050cb82eba2af9dcf7732e708234fa15f87e094298' \
    -d '{ "when": { "immediate": true } }' \
    'https://api.pushcode.jp/v1/push/af9db06579f5de5aa32a5c165d269c2f69e0fc0cae45b607993edbb28d45b37d'`
    #-d '{ "when": { "immediate": true},"who": {"userid_list": [1]},  "what": {"vars": {} } }' \
    #-d '{ "when": { "immediate": true,"datetime": "2019-12-23T15:00:00+0900"},"who": {"userid_list": [1]},  "what": {"vars": {} } }' \
    @response = Nokogiri::HTML(response)

 

    payload = {when: {immediate: true}}.to_json

    uri = URI(PUSHCODE_endpoint)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request['Content-Type'] = 'application/json'
    request['X-PUSHCODE-APIKEY'] = PUSHCODE_API_KEY
    request.body = payload

    @response = http.request(request)



    payload = {when: {immediate: true}}.to_json

    response = Faraday.post PUSHCODE_endpoint do |req|
      req.headers['Content-Type'] = 'application/json'
      req.headers['X-PUSHCODE-APIKEY'] = PUSHCODE_API_KEY  
      req.body = payload 
    end


    payload = {when: {immediate: true}}.to_json
    response = Faraday.post PUSHCODE_endpoint do |req|
      req.headers['Content-Type'] = 'application/json'
      req.headers['X-PUSHCODE-APIKEY'] = PUSHCODE_API_KEY  
      req.body = payload 
    end
=end
=begin
    #@aim = Aim.all
    #@aim = Aim.limit(5) 
    #@page = 0
    @aims = Aim.limit(5).offset(params[:page].to_i * 5)
    #@aims = Aim.limit(5).offset(params[:page].to_i)
    respond_to do |format|
      format.html
      format.js
    end
=end
    #@aims = Aim.limit(5) 
    @aims = Aim.recent 

    if user_signed_in?
      # ログイン中の場合の処理
      @login_or_out = 'ログイン中'
    else
      # ログインしていない場合の処理
      @login_or_out = 'ログアウト中'
    end

  end

  def index
    @aim = Aim.limit(5).offset(params[:page].to_i * 5)
    #@aim = Aim.limit(5) 
  end

  def load_more
    #@aims = Aim.offset(5).limit(5) 
    @aims = Aim.offset(params[:page].to_i * 5).limit(5)
    #@aims = Aim.offset(1 * 5).limit(5) #offsetでスキップする
    render partial: "aim", collection: @aims 
=begin
    last_id = params[:last_id].to_i
    @aim = Aim.where('id > ?', last_id).limit(5)
    respond_to do |format|
      format.html
      format.js
    end
=end
  end

=begin
  def index
    @aim = Aim.order(created_at: :desc).page(params[:page]).per(5)
    #@aim = Aim.all
    respond_to do |format|
      format.html
      format.js
    end
  end
=end
  
end
