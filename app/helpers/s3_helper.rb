module S3Helper
  def Yahoo(manko)
    "Yahoo, #{manko}!"
  end

  if Rails.env.production_render_com?
    s3 = Aws::S3::Resource.new(region: 'ap-northeast-1',access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key))
    bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))
  else
    s3 = Aws::S3::Resource.new(region: Rails.application.credentials.dig(:aws, :region),access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key))
    bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))
  end

  def s3_asset_path(logical_path)
    s3 = Aws::S3::Resource.new(
      region: Rails.application.credentials.dig(:aws, :region),
      access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key)
    )
    bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))

    # フィンガープリント付きのファイル名を取得
    fingerprinted_path = Rails.application.assets_manifest.assets[logical_path]

    # S3オブジェクトのキーを作成
    key = "assets/#{fingerprinted_path}"

    # S3オブジェクトのURLを返す
    #"https://#{Rails.application.credentials.dig(:aws, :bucket)}.s3.ap-northeast-1.amazonaws.com/#{key}"
    "https://d2hcwuo8gsf97u.cloudfront.net/#{key}"
    #https://aim-bucket.s3.ap-northeast-1.amazonaws.com/assets/Logo-32b516986ab7ce23f8ff68c83374d3cb621b507dc9a8a4aa86929d4b9531f30e.svg
  end
  def cloudfront_stylesheet_link_tag(source, options = {})
    s3 = Aws::S3::Resource.new(
      region: Rails.application.credentials.dig(:aws, :region),
      access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key)
    )
    bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))

    # フィンガープリント付きのファイル名を取得
    fingerprinted_path = Rails.application.assets_manifest.assets[source]

    # S3オブジェクトのキーを作成
    key = "assets/#{fingerprinted_path}"

    cloudfront_domain = 'd2hcwuo8gsf97u.cloudfront.net'
    source = "https://#{cloudfront_domain}/#{key}"
    #source = "http://#{cloudfront_domain}/#{key}"
    #source ="https://#{Rails.application.credentials.dig(:aws, :bucket)}.s3.ap-northeast-1.amazonaws.com/#{key}"
  
    #stylesheet_link_tag(source, options)
    #stylesheet_link_tag(source, content_type: 'text/css', Vary: 'Accept-Encoding')
    stylesheet_link_tag(source, content_type: 'text/css')
  end

  def cloudfront_favicon_link_tag(source, options = {})
    s3 = Aws::S3::Resource.new(
      region: Rails.application.credentials.dig(:aws, :region),
      access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key)
    )
    bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))
    fingerprinted_path = Rails.application.assets_manifest.assets[source]  # フィンガープリント付きのファイル名を取得
    key = "assets/#{fingerprinted_path}" # S3オブジェクトのキーを作成
    cloudfront_domain = 'd2hcwuo8gsf97u.cloudfront.net'
    source = "https://#{cloudfront_domain}/#{key}"
    favicon_link_tag(source)
  end
  def cloudfront_javascript_pack_tag(source, options = {})
    #s3 = Aws::S3::Resource.new(region: Rails.application.credentials.dig(:aws, :region),access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key))
    #bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))
    #fingerprinted_path = Rails.application.assets_manifest.packs[source]  # フィンガープリント付きのファイル名を取得
    #manifest_path = Rails.root.join('public', 'packs', 'manifest.json')
    #manifest = JSON.parse(File.read(manifest_path))
    #asset_path = manifest[source]['js']
    #manifest = readManifest();
    #source = manifest.js[source];
    #fingerprinted_path = Rails.application.assets.find_asset('packs/application.js').digest_path
    #fingerprinted_path = Rails.application.assets_manifest.assets['application.js']
    #fingerprinted_path = "application-3055a888c29068a9ff25.js"
    #fingerprinted_path = "application-a19bc2af213c4adc9762.js"
    #fingerprinted_path = javascript_pack_tag('application')
    #fingerprinted_path = Rails.application.config.assets.prefix + Rails.application.assets_manifest.assets["application.js"]
    #fingerprinted_path = Rails.application.assets_manifest.assets["application.js"]
    key = Webpacker.manifest.lookup(source+'.js')
    #key = "packs/js/#{fingerprinted_path}" # S3オブジェクトのキーを作成
    cloudfront_domain = 'd2hcwuo8gsf97u.cloudfront.net'
    source = "https://#{cloudfront_domain}#{key}"
    source
    #stylesheet_link_tag(source)
    #javascript_pack_tag(source, 'data-turbolinks-track': 'reload')
    #javascript_pack_tag(fingerprinted_path, 'data-turbolinks-track': 'reload')
    #<script src="ahttps://d2hcwuo8gsf97u.cloudfront.net/packs/js/application-a19bc2af213c4adc9762.js" data-turbolinks-track="reload"></script>
  end
=begin
  def s3_svg(key)
    s3 = Aws::S3::Resource.new(
      region: Rails.application.credentials.dig(:aws, :region),
      access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key)
    )
    bucket = s3.bucket(Rails.application.credentials.dig(:aws, :bucket))
    object = bucket.object(key)
    object.get.body.read.html_safe
  end

  def s3_image_tag(key, options = {})
    image_tag(ActiveStorage::Blob.service.url_for(key), options)
  end
  def s3_url(file_name)
    asset = Rails.application.assets.find_asset(file_name)
    if asset.nil?
      "File Not Found: #{file_name}"
    else
      "#{Rails.application.config.active_storage.service_url}/#{asset.digest_path}"
    end
  end

  module S3Helper
    def s3_url_for(key)
      s3 = Aws::S3::Resource.new
      obj = s3.bucket(ENV['S3_BUCKET_NAME']).object(key)
      obj.public_url
    end
  end
=end
end

