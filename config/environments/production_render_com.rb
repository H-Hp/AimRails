require_relative "production"#production.rbの設定をオーバーライド
Rails.application.configure do
  # production.rbを上書きする設定を記述
  config.hosts << "aim-rails.onrender.com"
  config.hosts.clear #全てのhostを受け入れる
end
