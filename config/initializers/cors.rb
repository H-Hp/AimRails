Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # 開発中だけ
    #origins 'https://aegis-mysite-checker.vercel.app/' #許可するのはフロント側のURL・監視ツールのURLを許可
    #origins 'https://aim-room.com' #https://aim-room.comは自身なのでoriginsに書かなくても普通に通る

    resource '/health_check',
    #resource '*',
      headers: :any,
      methods: [:get, :options]
  end
end