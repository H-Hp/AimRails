require_relative "production"#production.rbの設定をオーバーライド
Rails.application.configure do
  # production.rbを上書きする設定を記述
  #config.hosts << "aim-rails.onrender.com"
  config.hosts << "aim-yw6r.onrender.com"
  config.hosts.clear #全てのhostを受け入れる

  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present? || ENV['RENDER'].present?
  config.assets.compile = true
  config.active_storage.service = :local
end
