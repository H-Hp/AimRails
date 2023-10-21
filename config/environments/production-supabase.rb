require_relative "production" #production.rbの設定をオーバーライド
Rails.application.configure do
  config.hosts << "127.0.0.1"
end