server '13.114.132.66', user: 'ec2-user', roles: %w{app db web}
#server 'xxx.xxx.xxx.xxx',user: 'xxxxx',roles: %w{app db web},port: xxxxx,ssh_options: {keys: '~/.ssh/id_rsa'}
#server 'Elastic IPアドレス', user: 'ec2-user', roles: %w{app db web}

#デプロイ前に実行するには、before 'deploy:starting', 'my_custom_task:run'という設定を
#config/deploy.rbに追加することで実現できます。
#この設定により、deploy:startingタスクが実行される前に、my_custom_task:runタスクが実行されます。
before 'deploy:starting', 'my_custom_task:local_ImageBuild_dockerhub_push'
before 'deploy:starting', 'my_custom_task:ec2_up'

#カスタムタスクを呼び出す・デプロイの完了後に my_custom_task:run タスクが実行される
#after 'deploy:finished', 'my_custom_task:run'
#after 'deploy:finished', 'my_custom_task:ec2_up'

namespace :my_custom_task do
  desc "ローカルでDockerImageをビルドして作成し、タグ付けを行い、DockerHubへpush"
  task :local_ImageBuild_dockerhub_push do
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
      execute "docker push dockermy7777/aim:mini-app-latest"
      #execute "docker push dockermy7777/aim:mini-web-latest"
    end
  end
  desc "EC2での処理"
  task :ec2_up do
    on roles(:app) do
      execute "echo 'EC2での処理・pdw='; pwd"
      execute "docker pull dockermy7777/aim:mini-app-latest"
      #execute "docker pull dockermy7777/aim:mini-web_latest"
      #execute "cd /Aim"
      #execute "pwd;ls -a"
      #execute "docker-compose -f docker-compose-ec2-aim-mini.yml up -d"
      execute "docker-compose -f /Aim/docker-compose-ec2-aim-mini.yml up -d"
      #execute "docker-compose -f docker-compose-ec2-aim-mini.yml up"

      #execute "docker exec -it 1d90abc06630 bash" #appコンテナに入る
      #execute "docker exec -it aim_app_container bash" #appコンテナに入る
      #execute "rails -version"
      #execute "rails db:migrate"
      #execute "exit" #appコンテナから抜ける
      #execute "docker-compose -f docker-compose-ec2-aim-mini.yml restart"
    end
  end
end