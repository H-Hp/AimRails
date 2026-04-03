source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

#ruby '2.7.3'
ruby '3.3.6'

#gem 'rails', '~> 6.1.4', '>= 6.1.4.1'
gem "rails", "~> 8.0.0"

#gem 'sqlite3', '~> 1.4'
gem 'pg'

#gem 'sass-rails', '>= 6'

#gem 'puma', '~> 5.0'
gem "puma", ">= 6.0"#~> 6.0 は、Puma 6.0 以上、かつ 7.0 未満の最新バージョンを意味

#gem 'webpacker', '~> 5.0'
gem "propshaft"
gem 'jsbundling-rails'
gem 'cssbundling-rails'

gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.7'

#gem 'aws-sdk-s3'
gem 'aws-sdk-s3', '~> 1.48'
gem 'aws-sdk-rails'
#gem 'aws-eventstream', '~> 1.2.0'
gem 'rack-cors'
gem 'devise'
gem 'devise-i18n'

# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
gem 'meta-tags'
gem 'sitemap_generator'
gem 'whenever', require: false

gem 'redcarpet'
gem 'kaminari'

#gem "openai_ruby"
gem "ruby-openai"

# gem 'image_processing', '~> 1.2'

gem 'bootsnap', '>= 1.4.4', require: false

gem 'pry'
gem 'pry-rails'

gem 'dotenv-rails' 

#gem 'react-rails'
#gem 'react-rails', '3.2.1'
#gem 'sprockets-rails'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  #gem 'rspec-rails','~> 3.6'
  gem "rspec-rails", "~> 4.0.1"
  #gem 'spring-commands-rspec'
  gem 'rails-controller-testing'
end

group :development do
  gem 'web-console', '>= 4.1.0'
  #gem 'rack-mini-profiler', '~> 2.0'
  gem 'listen', '~> 3.3'
  #gem 'spring'

  gem 'capistrano'
  gem 'capistrano-rbenv'
  gem 'capistrano-bundler'
  gem 'capistrano-rails'

end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
