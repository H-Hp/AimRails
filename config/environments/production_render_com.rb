require_relative "production"#production.rbの設定をオーバーライド
Rails.application.configure do
  # production.rbを上書きする設定を記述
  config.hosts << "aim-rails.onrender.com"
end
