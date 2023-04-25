lock "~> 3.17.2" # Capistranoのバージョン
set :application, "Aim" #デプロイするアプリの名称
set :repo_url, "git@github.com:H-Hp/AimRails.git" #リポジトリURL
set :branch, 'main' #リポジトリのブランチ
set :deploy_to, '/Aim' #デプロイ先のディレクトリ
set :linked_files, %w(config/master.key) #シンポリックリンクを貼るファイル
set :linked_dirs, %w(log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system) #シンポリックリンクを貼るディレクトリ
set :keep_releases, 5 #保持するリリースバージョンの数
set :rbenv_ruby, '2.7.3' #デプロイ先サーバーにインストールされているRubyバージョン
set :log_level, :debug #出力するログレベル

set :default_env, { #デプロイ先サーバーに設定する環境変数
  rbenv_root: "/home/user/.rbenv",
  path: "/home/user/.rbenv/bin:$PATH"
}

set :ssh_options, { # SSH接続設定
  auth_methods: ['publickey'], 
  #keys: ['~/.ssh/プライベートキーの名前.pem']
  keys: ['/Users/hayashihiroki/Desktop/Aim/Rails_Aim/aim-mini-ec2-keypair.pem']
}