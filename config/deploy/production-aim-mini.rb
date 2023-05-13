server '13.114.132.66', user: 'ec2-user', roles: %w{app db web}
#server 'xxx.xxx.xxx.xxx',user: 'xxxxx',roles: %w{app db web},port: xxxxx,ssh_options: {keys: '~/.ssh/id_rsa'}
#server 'Elastic IPアドレス', user: 'ec2-user', roles: %w{app db web}

#デプロイ前に実行するには、before 'deploy:starting', 'my_custom_task:run'という設定を
#config/deploy.rbに追加することで実現できます。
#この設定により、deploy:startingタスクが実行される前に、my_custom_task:runタスクが実行されます。
#before 'deploy:starting', 'my_custom_task:local_ImageBuild'
#before 'deploy:starting', 'my_custom_task:local_dockerhub_push'
#before 'deploy:starting', 'my_custom_task:ec2_up'

#test
before 'deploy:starting', 'my_custom_task:test_local'
before 'deploy:starting', 'my_custom_task:test_ec2'

#カスタムタスクを呼び出す・デプロイの完了後に my_custom_task:run タスクが実行される
#after 'deploy:finished', 'my_custom_task:run'
#after 'deploy:finished', 'my_custom_task:ec2_up'

namespace :my_custom_task do
  desc "testローカル"
  task :test_local do
    run_locally do
      execute "ls"
      execute "echo 'pdw='; pwd"
      #execute "docker ps"
      execute "echo 'a'"
    end
  end
  desc "test EC2"
  task :test_ec2 do
    on roles(:app) do
      execute "echo 'test EC2・pdw='; pwd"
    end
  end
  desc "ローカルでDockerImageをビルドして作成し、タグ付けを行う"
  task :local_ImageBuild do
    #on roles(:app) do
      # カスタムタスクの内容
      #execute "echo 'aa'"
      #execute "echo 'pdw='; pwd"
    #end
    run_locally do
      execute "echo 'ローカルでDockerImageをビルドして作成し、タグ付けを行い、DockerHubへpush'; pwd"
      execute "docker-compose -f docker-compose-aim-mini.yml build"
      execute "docker tag aim-mini-app-image:latest dockermy7777/aim:mini-app-latest"
      #execute "docker tag aim-mini-web-image:latest dockermy7777/aim:mini-web-latest"
    end
  end
  desc "ローカルでDockerHubへpush"
  task :local_dockerhub_push do
    run_locally do
      execute "docker push dockermy7777/aim:mini-app-latest"
      #execute "docker push dockermy7777/aim:mini-web-latest"
    end
  end
  desc "EC2での処理"
  task :ec2_up do
    on roles(:app) do
      execute "echo 'EC2での処理・pdw='; pwd"
      execute "docker pull dockermy7777/aim:mini-app-latest"
      execute "docker-compose -f /Aim/docker-compose-ec2-aim-mini.yml up -d"
      
      execute "docker exec aim_app_container rails -v"
      execute "docker exec aim_app_container bundle install"
      execute "docker exec aim_app_container rails db:migrate"
      #execute "docker exec aim_app_container apt-get update"
      #execute "docker exec aim_app_container apt-get install yarn"
      #execute "docker exec aim_app_container apt-get install yarn=1.22.5-1"
      #execute "docker exec aim_app_container rails assets:precompile"
      #execute "docker exec aim_app_container rake assets:precompile"
      execute "docker exec aim_app_container bundle exec rake assets:precompile RAILS_ENV=production NODE_OPTIONS=--openssl-legacy-provider"
      #execute "docker exec aim_app_container rake assets:precompile RAILS_ENV=production-aim-mini"
      #execute "rails -v"
      #execute "rails db:migrate"
      #execute "exit" #appコンテナから抜ける
      execute "docker-compose -f /Aim/docker-compose-ec2-aim-mini.yml restart"
    end
  end
  desc "S3へ静的ファイルをpush"
  task :s3_staticfile_push do
    run_locally do
      execute "RAILS_ENV=production rake assets:precompile NODE_OPTIONS=--openssl-legacy-provider"
      
      #bundle exec cap production-aim-mini my_custom_task:s3_staticfile_push
      puts "Hello, world!"
      #s3 = Aws::S3::Resource.new
      #obj = s3.bucket('<%= Rails.application.credentials.dig(:aws, :bucket) %>').object('key')
      #obj.upload_file('/path/to/file')
      #obj.presigned_url(:get)
      require_relative '../environment'
      require 'aws-sdk-s3'
      s3 = Aws::S3::Resource.new(
        region: Rails.application.credentials.dig(:aws, :region),
        credentials: Aws::Credentials.new(
          Rails.application.credentials.dig(:aws, :access_key_id),
          Rails.application.credentials.dig(:aws, :secret_access_key)
        )
      )
      bucket_name = Rails.application.credentials.dig(:aws, :bucket)
      bucket = s3.bucket(bucket_name)
      raise "Bucket #{bucket_name} does not exist" unless bucket.exists?
  
      # ローカルの`public/assets`ディレクトリのファイルをS3にアップロード
      Dir.glob('public/assets/**/*').each do |path|
        next if File.directory?(path)
  
        key = path.gsub('public/', '') # `public`ディレクトリを除去してS3の`key`に設定
        puts 'assetsのpath='+path
        puts 'assetsのkey='+key
        obj = bucket.object(key)
        obj.upload_file(path, content_type: 'text/css')
        #obj.upload_file(path)
      end
      Dir.glob('public/packs/**/*').each do |path|
        next if File.directory?(path)
  
        key = path.gsub('public/', '') # `public`ディレクトリを除去してS3の`key`に設定
        puts 'packsのpath='+path
        puts 'packsのkey='+key
        obj = bucket.object(key)
        obj.upload_file(path)
      end
    end
  end
end