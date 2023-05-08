require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.hosts << "aim-yw6r.onrender.com"
  config.hosts << "aim-get.com"
  config.hosts << "www.aim-get.com"
  config.hosts << "0.0.0.0"
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  #config.public_file_server.enabledがtrueに設定されている場合、Railsアプリケーションはプリコンパイルされたアセットファイルを静的ファイルとして提供
  #config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
  #config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present? || ENV['RENDER'].present?
  config.public_file_server.enabled = true
  config.assets.compile = false
  config.active_storage.service = :local
  config.log_level = :info
  config.log_tags = [ :request_id ]
  config.action_mailer.perform_caching = false
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.active_support.disallowed_deprecation = :log
  config.active_support.disallowed_deprecation_warnings = []
  config.log_formatter = ::Logger::Formatter.new
  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end
  config.active_record.dump_schema_after_migration = false
end
