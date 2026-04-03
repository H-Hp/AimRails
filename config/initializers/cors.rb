Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://aegis-mysite-checker.vercel.app" #許可するOrigin・完全一致が必要
    resource "/health_check", #許可するエンドポイント・ここだけ許可
      headers: :any,
      methods: [:get], #不要なPOST/PUTなど抜く
      max_age: 600 # プリフライトキャッシュ（10分）・パフォーマンス向上
  end
end

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

# Rails.application.config.middleware.insert_before 0, Rack::Cors do
#   allow do
#     origins "example.com"
#
#     resource "*",
#       headers: :any,
#       methods: [:get, :post, :put, :patch, :delete, :options, :head]
#   end
# end
