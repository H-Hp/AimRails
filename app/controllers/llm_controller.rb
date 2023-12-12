#require "openai"
require 'openai'
#require "ruby/openai"
require 'rake'

class LlmController < ApplicationController
  protect_from_forgery #AjaxのCSRF対策回避

  def generate()
    prompt=params.permit(:prompt)

    client = OpenAI::Client.new(access_token:  Rails.application.credentials.openai[:api_key])
    response = client.chat(
      parameters: {
        model: "gpt-3.5-turbo", # Required. # 使用するGPT-3のエンジンを指定
        messages: [
          { role: "system", content: "You are a helpful assistant. response to japanese" },
          { role: "user", content: "次の特徴を持つ人に適した仕事もしくはやりたいことに適していることはなんだと思いますか？"+params[:prompt] }],
          #{ role: "user", content: "Who won the world series in 2020?" }],
        temperature: 0.7, # 応答のランダム性を指定
        max_tokens: 200,  # 応答の長さを指定
      },
      )

    #puts response['choices'][0]['message']['content']
    #render :json => response['choices'][0]['message']['content']

    respond_to do |format|
      #format.json { render json: { a: "a" } }
      format.json { render json: { content: response['choices'][0]['message']['content'] } }
    end

=begin
    @sample_data = {
      id: 1,
      name: 'Example',
      description: 'This is a sample description'
    }
    #render :json => @sample_data['id']
    #render 1
{
  "id": "1",
  "model": "User",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "こんにちは、ユーザーさん。何をお手伝いできますか？"
      }
    }
  ]
}

    response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt }
          ],
        }
      )
      @answer = response.dig("choices", 0, "message", "content")
=end


  end

  def index
  end

=begin
    response = client.completions(
      model: "text-davinci-003",
      #prompt: "私の好きな食べ物はりんごで、好きな音楽はaikoです。それを考慮に入れたとき、私の好きな色は何だと思いますか?",
      prompt: prompt,
      temperature: 0,
      max_tokens: 100
    )

    puts response["choices"][0]["text"]


    client = OpenAI::Client.new(access_token: "ACCESS_TOKEN_GOES_HERE")

    res = client.completions(
            parameters: {
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 10
            })

    puts res["choices"].map{|i| i["text"]}.join
    #render :json => "@result"
    @data = { message: 'Hello, World!' } # ここに任意のデータを設定

    respond_to do |format|
      format.json { render json: @data }
    end

 
=end
=begin
      response = Openai::Completion.create(
        engine: "text-davinci-003",
        prompt: "私の好きな食べ物はりんごで、好きな音楽はaikoです。それを考慮に入れたとき、私の好きな色は何だと思いますか？",
        max_tokens: 100,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\\n"]
      )

      puts response.choices.first.text.strip

      client = OpenAI::Client.new
      response = client.completions(
        model: "text-davinci-003",
        #prompt: "私の好きな食べ物はりんごで、好きな音楽はaikoです。それを考慮に入れたとき、私の好きな色は何だと思いますか?",
        prompt: prompt,
        temperature: 0,
        max_tokens: 100
      )

      puts response["choices"][0]["text"]


      # OpenAIにテキスト生成リクエスト送信
      @result = OpenAI::Client.new.completions(
        parameters: {
          prompt: prompt  
        }
      )
=end
      #render :json => @result
end
