#require "openai"
require 'openai'
#require "ruby/openai"
require 'rake'

class LlmController < ApplicationController
  protect_from_forgery #AjaxのCSRF対策回避

  def generate()
    prompt=params.permit(:prompt)

    client = OpenAI::Client.new(access_token:  Rails.application.credentials.dig(:openai, :api_key))
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo", # Required. # 使用するGPT-3のエンジンを指定
        messages: [
          { role: "system", content: "You are a helpful assistant. response to japanese" },
          { role: "user", content: "次の特徴を持つ人に適した仕事もしくはやりたいことに適していることはなんだと思いますか？"+params[:prompt] }],
        temperature: 0.7, # 応答のランダム性を指定
        max_tokens: 200,  # 応答の長さを指定
      },
      )
    respond_to do |format|
      format.json { render json: { content: response['choices'][0]['message']['content'] } }
    end
  end

  def index
  end
end
