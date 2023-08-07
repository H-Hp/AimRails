require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module AimRails
  class Application < Rails::Application

    #devide日本語化
    config.i18n.default_locale = :ja
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        # 許可するドメイン
        #origins "{{ ローカル環境ドメイン }}", "{{ テスト環境ドメイン }}", "{{ 本番環境ドメイン }}"
        origins "{{ localhost:3000 }}", "{{ 0.0.0.0:3000 }}", "{{ https://aim-yw6r.onrender.com/ }}", "{{ https://www.aim-get.com/ }}"
        #origins 'http://localhost:3000'
        #resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options]
        # 許可するヘッダとメソッドの種類
        resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :head, :options]
      end
    end
  end
end
