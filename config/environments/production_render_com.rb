require_relative "production"#production.rbの設定をオーバーライド
Rails.application.configure do
  # production.rbを上書きする設定を記述
  #config.hosts << "aim-rails.onrender.com"
  config.hosts << "aim-yw6r.onrender.com"
  config.hosts.clear #全てのhostを受け入れる

  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present? || ENV['RENDER'].present?
  config.x.aws.region = 'ap-northeast-1'
  ENV['AWS_REGION'] = 'ap-northeast-1'
  #config.assets.compile = true
  #config.active_storage.service = :amazon
  config.active_storage.service = :local
=begin
  config.paperclip_defaults = {
    :storage        => :s3,
    :s3_region      => 'ap-northeast-1', # リージョン名を指定
    :s3_host_name   => 's3-ap-northeast-1.amazonaws.com',
    :bucket         => ENV['S3_BUCKET_NAME'],
    :s3_credentials => {
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    }
  }
=end
  config.paperclip_defaults = {
    storage: :s3,
    s3_host_name: "s3-ap-northeast-1.amazonaws.com",
    s3_region: 'ap-northeast-1', # or ENV['AWS_REGION']
    s3_credentials: {
      bucket: ENV['AWS_BUCKET'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
    }
  }

end
