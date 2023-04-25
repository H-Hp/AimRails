# DSLの読み込みと環境ごとの設定
require "capistrano/setup"

# deploymentタスクの読み込み
require "capistrano/deploy"

# 追加ライブラリ（Git）の読み込み
require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

# 追加ライブラリ（その他）の読み込み
require "capistrano/rbenv"
require "capistrano/bundler"
require "capistrano/rails/assets"
require "capistrano/rails/migrations"
#require "capistrano/rvm"
#require "capistrano/chruby"
#require "capistrano/passenger"

# カスタムタスクのインポート
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }