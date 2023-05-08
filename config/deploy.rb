lock "~> 3.17.2" # Capistranoのバージョン

set :application, "Aim" #デプロイするアプリの名称
set :repo_url, "git@github.com:H-Hp/AimRails.git" #リポジトリURL
set :branch, 'main' #リポジトリのブランチ
set :deploy_to, '/home/ec2-user/AimTest' #デプロイ先のディレクトリ
#set :linked_files, %w(config/master.key) #シンポリックリンクを貼るファイル
#set :linked_dirs, %w(log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system) #シンポリックリンクを貼るディレクトリ
set :keep_releases, 5 #保持するリリースバージョンの数
#set :rbenv_ruby, '2.7.3' #デプロイ先サーバーにインストールされているRubyバージョン
set :log_level, :debug #出力するログレベル

#set :default_env, { #デプロイ先サーバーに設定する環境変数
  #rbenv_root: "/homeec2-user/AimTest/.rbenv",
  #path: "/home/ec2-user/AimTest/.rbenv/bin:$PATH"
#}

set :ssh_options, { # SSH接続設定
  auth_methods: ['publickey'], #SSH接続の認証方法としてpublickey を指定
  #keys: ['~/.ssh/プライベートキーの名前.pem']
  keys: ['/Users/hayashihiroki/Desktop/Aim/Rails_Aim/aim-mini-ec2-keypair.pem'],
  #keys: [ENV.fetch('PRODUCTION_SSH_KEY').to_s],
  forward_agent: true #ローカル環境で管理しているSSH秘密鍵を中継できる・CircleCI上でSSHコマンドを実行する際に、ローカルで保持しているSSH鍵を使用して、EC2インスタンスにSSH接続することができます。つまり、CircleCIからローカルのSSH鍵を参照して、EC2にSSH接続できるようになります
}
=begin
=end

