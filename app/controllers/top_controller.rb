require 'net/http'
require 'uri'
require 'json'

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


    @PUSHCODE_API_KEY="bf423538549f5ef9cda811050cb82eba2af9dcf7732e708234fa15f87e094298"
    @PUSHCODE_endpoint="https://api.pushcode.jp/v1/push/af9db06579f5de5aa32a5c165d269c2f69e0fc0cae45b607993edbb28d45b37d"

    response = `curl -H 'X-PUSHCODE-APIKEY: #{@PUSHCODE_API_KEY}' 'https://api.pushcode.jp/v1/push/list'`
    #response = `curl -H 'X-PUSHCODE-APIKEY: #{@PUSHCODE_API_KEY}' {@PUSHCODE_endpoint}`
    @pushes = Nokogiri::HTML(response)

  end
end
