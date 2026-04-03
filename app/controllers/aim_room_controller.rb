class AimRoomController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
=begin
  $itemData = [
    { "id": 1, "gacha_id": 0, "name": "デフォ壁紙", "type": "background", "description": "デフォルトの壁紙", "rarity": 0, "max_quantity": 1, "path": "bg0" },
    { "id": 2, "gacha_id": 0, "name": "デフォキャラ", "type": "chara", "description": "デフォルトの壁紙", "rarity": 0, "max_quantity": 1, "path": "chara0" },
    { "id": 3, "gacha_id": 0, "name": "デフォ机", "type": "desk", "description": "デフォルトの机", "rarity": 0, "max_quantity": 1, "path": "desk0" },
    { "id": 4, "gacha_id": 0, "name": "しずかな音楽", "type": "music", "description": "デフォルトの音楽1", "rarity": 0, "max_quantity": 1, "path": "music01" },
    { "id": 5, "gacha_id": 0, "name": "シャイニングスター", "type": "music", "description": "デフォルトの音楽2", "rarity": 0, "max_quantity": 1, "path": "music02" },

    { "id": 6, "gacha_id": 1, "name": "まあ元気出せよ", "type": "obj", "description": "辛いときに響く言葉", "rarity": 25, "max_quantity": 1, "path": "obj1" },
    { "id": 7, "gacha_id": 1, "name": "壁紙1", "type": "background", "description": "アラブ風の背景", "rarity": 25, "max_quantity": 1, "path": "bg1" },
    { "id": 8, "gacha_id": 1, "name": "壁紙2", "type": "background", "description": "シンガポール風の背景", "rarity": 25, "max_quantity": 1, "path": "bg2" },
    { "id": 9, "gacha_id": 1, "name": "時計", "type": "obj", "description": "シンプルな時計", "rarity": 25, "max_quantity": 1, "path": "obj2" },
    { "id": 10, "gacha_id": 1, "name": "猫1", "type": "obj", "description": "白い猫", "rarity": 25, "max_quantity": 1, "path": "obj3" },
    { "id": 11, "gacha_id": 1, "name": "キャラ1", "type": "chara", "description": "ロングヘアーの女の子", "rarity": 25, "max_quantity": 1, "path": "chara1" },

    { "id": 12, "gacha_id": 2, "name": "音楽1", "type": "music", "description": "洋風の音楽", "rarity": 25, "max_quantity": 1, "path": "music1" },
    { "id": 13, "gacha_id": 2, "name": "机", "type": "desk", "description": "おしゃれな机", "rarity": 25, "max_quantity": 1, "path": "desk1" }
  ];
=end
  before_action do
    if Rails.env.development? && !user_signed_in? #環境がdevelopmentで、かつログアウト中なら
      @user_id = 1
      @user_name="development_user"
    else
      # ログインしてればそのID、してなければ 0 (またはゲスト用ID)
      #@user_id = current_user&.id || 0 
      #@user_name = current_user.user_name
      @user_id = current_user&.id || 0
      @user_name = current_user&.user_name || "guest"
    end
  end

  def index
    if user_signed_in?
      # ログイン中の場合の処理
      @isLoggedIn = true
      puts "ログイン中";Rails.logger.error "ログイン中"

      @AimRoom = AimRoom.find_by(user_id: @user_id)
      #@UserItem = UserItem.find_by(user_id: @user_id) #1つのデータだけ取得
      
      @user_items_not_default = UserItem.where(user_id: @user_id) #複数取得・デフォルトアイテム以外の取得したアイテム情報
      if @user_items_not_default.present? #データがあるなら
        item_ids = @user_items_not_default.pluck(:item_id) #item_id配列を取り出す
        @user_items_not_default = Item.where(id: item_ids) #itemsテーブルから取得
      end

      puts "@AimRoom: #{@AimRoom.to_json}"
      puts "@UserItem: #{@user_items_not_default.to_json}"
    else
      # ログインしていない場合の処理
      @isLoggedIn = false
      puts "ログアウト中";Rails.logger.error "ログアウト中"
    end

    gachas = Gacha.all
    #@gachas=gachas.to_json
    @gachas=gachas.to_a
    puts "@gachas:#{@gachas}"

    mission = Mission.all
    @missions=mission.to_a
    puts "@missions:#{@missions}"

    #毎日深夜3時にリセット・batで処理させる
    #mission_daylly_reset

  end
  
  def resolve_path
    original_paths = params[:paths]
    #original_paths = params[:data]
    Rails.logger.error "original_paths: #{original_paths}"
    #my_items_path_array = original_paths.pluck(:path)
    resolved_paths=[]
    original_paths.each do |path|
      #resolved_paths.push(helpers.asset_path(path))
      resolved_paths.push(helpers.asset_path("aimroom/item/"+path+".png"))
    end
    Rails.logger.error "resolved_paths: #{resolved_paths}"
    render json: { resolved_paths: resolved_paths }
  end
=begin
    original_path = params[:path]
    resolved_path = helpers.asset_path(original_path)
    #resolved_path = helpers.asset_path('aimroom/shop.png')
    Rails.logger.error "resolved_path: #{resolved_path}"
    #render json: { original_path: original_path, resolved_path: resolved_path }
    render json: { resolved_path: resolved_path }
=end

  def resolve_path_img_json
    path = params[:path]
    puts "resolve_path_img_jsonのpath:#{path}"
    img_path = helpers.asset_path("aimroom/item/"+path+".png")
    json_path = helpers.asset_path("aimroom/item/"+path+".json")
    render json: { img_path: img_path, json_path:json_path}
  end
  def init_env
    current_user_id = 0
    if user_signed_in?
      current_user_id = current_user.id
    else
      current_user_id = 1
    end
    #env_data = PlacedItem.find_by(user_id: current_user.id)
    #env_data = PlacedItem.where(user_id: current_user.id)
    env_data = PlacedItem.where(user_id: current_user_id)
    Rails.logger.error "env_data: #{env_data}"
    env_data.each do |item|
      type = item.properties['type']  # "background", "chara", "desk" など
      puts "type: #{type}"
    end

    background = PlacedItem.joins(:item)
                          .where(user_id: current_user_id)
                          .where(items: { item_type: 'background' })
                          .first            
    background_path = background&.item&.path
    background_properties = background&.item&.properties
    #background_prefix = background&.item&.properties&.dig('prefix') #"bg0_"など
    background_prefix = "bg0_"
    puts "background_path: #{background_path}"
    if background_path.present?
      background_img_path = helpers.asset_path("aimroom/item/#{background_path}.png")
      background_json_path = helpers.asset_path("aimroom/item/"+background_path+".json")
    end
    puts "アセットコンパイルのbackground_img_path: #{background_img_path}" 
    puts "アセットコンパイルのbackground_json_path: #{background_json_path}" 
    puts "アセットコンパイルのbackground_prefix: #{background_prefix}" 


    #desk_path = PlacedItem.joins(:item).where(user_id: current_user_id).where(items: { item_type: 'desk' }).first&.item&.path
    desk = PlacedItem.joins(:item).where(user_id: current_user_id).where(items: { item_type: 'desk' }).first
    desk_path = desk&.item&.path
    desk_properties = desk&.item&.properties
    #desk_prefix = desk&.item&.properties&.dig('prefix') #desk0_など
    desk_prefix = "desk0_"
    if desk_path.present?
      desk_path = helpers.asset_path("aimroom/item/"+desk_path+".png")
    end
    puts "アセットコンパイルのdesk_path: #{desk_path}"
    puts "アセットコンパイルのdesk_desk_prefix: #{desk_prefix}"

    chara = PlacedItem.joins(:item).where(user_id: current_user_id).where(items: { item_type: 'chara' }).first
    chara_path = chara&.item&.path
    chara_properties = chara&.item&.properties
    #chara_prefix = chara&.item&.properties&.dig('prefix')#"chara0_"など
    chara_prefix = "chara0_"
    if chara_path.present?
      chara_img_path = helpers.asset_path("aimroom/item/"+chara_path+".png")
      chara_json_path = helpers.asset_path("aimroom/item/"+chara_path+".json")
    end
    puts "アセットコンパイルのchara_img_path: #{chara_img_path}" 
    puts "アセットコンパイルのchara_json_path: #{chara_json_path}"

    obj = PlacedItem.joins(:item).where(user_id: current_user_id).where(items: { item_type: 'obj' }).first
    obj_path = obj&.item&.path
    puts "obj_path: #{obj_path}" 
    obj_properties = obj&.item&.properties
    #obj_prefix = obj&.item&.properties&.dig('prefix')#obj0_など
    obj_prefix = "obj0_"
    if obj_path.present?
      obj_img_path = helpers.asset_path("aimroom/item/"+obj_path+".png")
      obj_json_path = helpers.asset_path("aimroom/item/"+obj_path+".json")
    end
    puts "アセットコンパイルのobj_img_path: #{obj_img_path}" 
    puts "アセットコンパイルのobj_json_path: #{obj_json_path}"

    picture = PlacedItem.joins(:item).where(user_id: current_user_id).where(items: { item_type: 'picture' }).first
    picture_path = picture&.item&.path
    if picture_path.present?
      picture_path = helpers.asset_path("aimroom/item/"+picture_path+".png")
    end
    puts "アセットコンパイルのpicture_path: #{picture_path}" 



    background_info = Item.joins("INNER JOIN placed_items ON items.id = placed_items.item_id")
                     .where(placed_items: { user_id: current_user_id })
                     .where(item_type: 'background')
                     .select('items.path, items.name, placed_items.x_position, placed_items.y_position')
                     .first
    puts "background_info: #{background_info.x_position}" 

    musics = UserItem.joins(:item)
       .where(items: { item_type: 'music' })
       .select('user_items.*, items.*')

    
    render json: { 
      background_img_path: background_img_path,
      background_json_path: background_json_path,
      background_prefix: background_prefix ,
      chara_img_path: chara_img_path, 
      chara_json_path: chara_json_path, 
      chara_prefix: chara_prefix,
      obj_img_path: obj_img_path, 
      obj_json_path: obj_json_path, 
      obj_prefix: obj_prefix,
      picture_path: picture_path,
      desk_path: desk_path,
      musics: musics
    }
  end
  def update_env
    new_placed_items = params[:new_placed_items]
    puts "受け取った新しいnew_placed_items: #{new_placed_items}"
    new_placed_items = JSON.parse(new_placed_items) if new_placed_items.is_a?(String)# 文字列ならパース "{\"bg\":\"bg0\",\"obj\":\"obj2\"...}"とかならjsonに変換
    
    aim_room = AimRoom.find_by(user_id: @user_id)
    aim_room.update!( placed_items: params[:new_placed_items] )
    render json: { env_data: "end" }
  end
=begin
    #received_data = params[:sendData]  # Or just params for accessing sent data
    #type = received_data[:type]
    #path = received_data[:path]
    new_item_id = params[:id]
    type = params[:type]
    #path = params[:path]
    puts "new_item_id: #{new_item_id}" 
    puts "type: #{type}" 
    #puts "path: #{path}" 

    item_type=''
    if type=="background"
      item_type="background"
    elsif type=="desk"
      item_type="desk"
    elsif type=="chara"
      item_type="chara"
    elsif type=="obj"
      item_type="obj"
    elsif type=="picture"
      item_type="picture"
    end

    item = PlacedItem.find_by("properties->>'type' = ?", type)
    item.update(item_id: new_item_id) if item


    render json: { env_data: new_item_id }
=end


  def check_login_status
    if user_signed_in?
      render json: { logged_in: true }
    else
      render json: { logged_in: false }
    end
  end

  def check_crystal_amount
    if user_signed_in?
      @AimRoom = AimRoom.find_by(user_id: current_user.id)
      puts "@AimRoom.currency: #{@AimRoom.currency}";Rails.logger.error "@AimRoom.currency: #{@AimRoom.currency}"
      render json: { cristal_amount: @AimRoom.currency }
      #render json: { cristal_amount: 500 }
    else
      render json: { cristal_amount: 0 }
    end
  end

=begin
    # 単発ガチャの実行
    @single_results = [
      GachaLottery.gacha(config, { ceil_count: 40 }, 0.005),
      GachaLottery.gacha(config, { ceil_count: 40 }, 0.04),
      GachaLottery.gacha(config, { ceil_count: 40 }, 0.7),
      GachaLottery.gacha(config, { ceil_count: 99 }, 0.7)
    ]
    @get_item=GachaLottery.gacha(config, { ceil_count: 40 }, 0.7)
=end
  def gacha
    @gacha_id = params[:gacha_id]
    isGachaSkipSave = params[:isGachaSkipSave]
    isGachaNoCost = params[:isGachaNoCost]
    Rails.logger.error "ガガガチャロロロロログ:gacha_id： #{@gacha_id}"
    @gacha = Gacha.find_by(id: @gacha_id)
    #@gacha = Gacha.find_by(id: params[:gacha_id])
    #@gacha = Gacha.find_by(id: 1)
    #@gacha = Gacha.find(1) 

    #config = GachaConfig.get_config
    config = GachaConfig.get_config(@gacha_id)
    #config = get_gacha_config(@gacha_id)
    Rails.logger.error "config： #{config}"

    #random_number = rand(0.005..1.0)#0.005から1までのランダムな小数を生成
    #random_number = ((rand * 0.995) + 0.005).round(3)# 0.005~1の範囲で乱数を生成し、小数点以下3桁までに丸める
    #possible_values = [0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9] # 可能な値を配列で定義
    #possible_values = [0.005, 0.04, 0.7] # 可能な値を配列で定義
    #random_number = possible_values.sample# ランダムに1つ選択

    # ガチャの乱数決定
    rval=""
    if Rails.env.development? #開発環境
      #特定の挙動（SSR/SR/R）をテストするために配列から選ぶ
      possible_values = [0.005, 0.04, 0.7] #（SSR/SR/R）
      rval = possible_values.sample
      Rails.logger.debug "Debug Gacha: rval固定値 #{rval} を使用"
    else #本番環境
      rval = rand #0.0000...から0.9999...までの完全な乱数を生成
      Rails.logger.error "rval： #{rval}"
    end

    #user作成
    aimRoom = AimRoom.find_by(user_id: @user_id)
    Rails.logger.error "これがとれるかどうか@AimRoom： #{aimRoom.to_json}"
    Rails.logger.error "これがとれるかどうか@AimRoom： #{aimRoom.pickup_ceil_count}"

    #@get_item=GachaLottery.gacha1(config, { ceil_count: 40 }, rval) #ガチャを一回回し、抽選し、アイテムのデータを1つ取得
    @gacha_result=GachaLottery.gacha1(config, aimRoom, rval, @gacha_id) #ガチャを一回回し、抽選し、アイテムのデータを1つ取得

    Rails.logger.error "ガチャの結果： #{@gacha_result}"
    #data = master.find { |item| item[:id] == 3 }# idが3のデータを探し出す

    #当たったアイテムidからデータを持ってくる
    @get_item_data = Item.find { |item| item[:id] == @gacha_result[:id] }# idが3のデータを探し出す
    Rails.logger.error "ゲットしたアイテムのデータ #{@get_item_data.to_json}"

    #user_gachasテーブルにガチャの結果を入れる
    UserGacha.new(user_id: current_user.id, item_id: @gacha_result[:id], gacha_id: @gacha_id, acquired_at: Time.current)

    #AimRoomテーブルの総回転数+1、ピックアップの天井カウント+1(gacha_lottery内で更新)、共通保証の天井カウント+1(gacha_lottery内で更新)
    aimRoom = AimRoom.find_by(user_id: current_user.id)
    aimRoom.update(total_gacha_rolls: @gacha_result[:new_total_ssr_count]+=1, total_ssr_count: @gacha_result[:new_total_ssr_count], pickup_ceil_count: @gacha_result[:new_pickup_ceil_count])

    #クリスタル消費とガチャ回した回数を更新
    unless isGachaNoCost #falseの時だけ処理
      #aimRoom = AimRoom.find_by(user_id: current_user.id)
      now_Cristal = aimRoom.currency - @gacha.cost
      aimRoom.update(currency: now_Cristal)
    end

    #アイテムをdbのUserItemテーブルに格納・保有量も増やす
    unless isGachaSkipSave #falseの時だけ処理
      user_item = UserItem.find_by(user_id: current_user.id, item_id: @get_item_data.id)#そのアイテムをUserItemテーブルにすでに保有しているかデータ取得
      #そのアイテムの保有量を増やす
      if user_item #すでにそのアイテムを取得していた場合
        user_item.increment!(:quantity) 
      else #まだそのアイテムを保有していなかった場合
        @userItem = UserItem.new(user_id: current_user.id, item_id: @get_item_data.id, quantity: 1, acquired_at: Time.current)
        @userItem.save
      end
    end

    render json: { item: @get_item_data }
  end
  #デバッグ用
  def debug_get_gacha_config
    gacha_id = params[:gacha_id]
    config = GachaConfig.get_config(gacha_id) #Configを取得
    render json: config # JSONとして返却
  end
  #def debug_gacha1(config,user,rval,gacha_id)
  def debug_gacha1
    config = params[:config]
    #user = params[:user]
    #user = OpenStruct.new(params[:user]) #Railsが扱えるハッシュに変換・#{"pickup_ceil_count"=>"0", "new_total_ssr_count"=>"0"}
    rval = params[:rval].to_f
    #puts "あああrval:#{rval}"
    gacha_id = params[:gacha_id]

    #値を数値に変換しながら新しいハッシュを作る
    user_data = {
      pickup_ceil_count:   params[:user][:pickup_ceil_count].to_i,
      total_ssr_count: params[:user][:total_ssr_count].to_i
    }
    #数値が入った状態で OpenStruct を作成
    user = OpenStruct.new(user_data)

    #config = config.is_a?(String) ? JSON.parse(config) : config #StringをHash (オブジェクト) に変換する・もしconfigが既にHashならそのままでOKだが、StringならJSON.parseが必要です
    config = JSON.parse(config, symbolize_names: true)
    puts "config: #{config}"

    gacha_result=GachaLottery.gacha1(config, user, rval, gacha_id)
    get_item_data = Item.find { |item| item[:id] == gacha_result[:id] }# idが3のデータを探し出す

    render json: get_item_data # JSONとして返却
  end
  #def debug_gacha10(config,user,rval,gacha_id)
  def debug_gacha10
    config = params[:config]
    #user = params[:user]
    user = OpenStruct.new(params[:user]) #Railsが扱えるハッシュに変換・#{"pickup_ceil_count"=>"0", "new_total_ssr_count"=>"0"}
    rval = params[:rval]
    gacha_id = params[:gacha_id]

    gacha_result=GachaLottery.gacha10(config, user, rval, gacha_id) 
    render json: gacha_result # JSONとして返却
  end

  def getmyitem
    #user_id = params[:user_id]
    #user_idで、$itemDataはアイテムの全データjson、itemsは保有しているアイテムidたちのjson
    #myitems = [1,2,3,4,6,13,12,11];
    #render json: { myitems: myitems ,itemData: $itemData }

    @user = User.find(params[:user_id])
    @owned_items = @user.items.includes(:user_items)

    #owned_items = user.items.includes(:user_items)
    #owned_items = current_user.items.includes(:user_items)
    render json: { owned_items: @owned_items }
  end

  def stripe
    # The library needs to be configured with your account's secret key.
    # Ensure the key is kept out of any version control system you might be using.
    #Stripe.api_key = 'sk_test_...'
    Stripe.api_key = 'sk_test_...'
    # This is your Stripe CLI webhook secret for testing your endpoint locally.
    endpoint_secret = ''
    #set :port, 3000

    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil

    begin
        event = Stripe::Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    rescue JSON::ParserError => e
        # Invalid payload
        status 400
        return
    rescue Stripe::SignatureVerificationError => e
        # Invalid signature
        status 400
        return
    end

    # Handle the event
    case event.type
    when 'payment_intent.succeeded'
        payment_intent = event.data.object

        # PaymentIntentから金額を取得
        amount = payment_intent.amount
        currency = payment_intent.currency
        Rails.logger.info "Payment succeeded: Amount: #{amount} : #{currency}"

        #購入金額によって増加するクリスタルを変化
        new_Cristal=0
        if amount == 120
          new_Cristal = 100
        elsif a == 220
          new_Cristal = 200
        else
          new_Cristal = nil # 他の値の場合の処理
        end

        #data更新
        json_path = Rails.root.join('public', 'data.json')
        data = JSON.parse(File.read(json_path))
        now_Cristal = data['Cristal']
        Rails.logger.error "ロロロロログ: #{now_Cristal}"
        data['Cristal'] = now_Cristal+new_Cristal
        File.write(json_path, JSON.pretty_generate(data))
    # ... handle other event types
    else
        puts "Unhandled event type: #{event.type}"
    end

    #status 200
  end


  def check_mission_bonus

    #テーブルからレコード取得
    aimRoom = AimRoom.find_by(user_id: @user_id)
    mission_rewards = MissionReward.all()
    missions = Mission.all()
    user_mission_login = UserMission.find_by(user_id: @user_id , mission_id: 1)
    user_mission_playtime = UserMission.find_by(user_id: @user_id, mission_id: 3)
    user_mission_gachaRoll = UserMission.find_by(user_id: @user_id, mission_id: 2)

    #まだ取得してないけど、獲得条件を満たしているミッション数 #statusがyetの中から新たにミッションを達成できてる数を取得し、その数を返す
    #unclaimed_rewards_count また報酬は獲得してないけど報酬の獲得権をゲットした数字
    new_login_unclaimed_rewards_count = LoginMissionClearCheck(user_mission_login.completed, aimRoom.last_login_at, user_mission_login.unclaimed_rewards_count)
    new_playtime_unclaimed_rewards_count = PlaytimeMissionClearCheck(aimRoom.daily_play_time, user_mission_playtime.unclaimed_rewards_count, user_mission_playtime.progress)
    new_gacharoll_unclaimed_rewards_count = GachaMissionClearCheck(aimRoom.total_gacha_rolls, user_mission_gachaRoll.unclaimed_rewards_count, user_mission_gachaRoll.progress)

    #user_missionテーブル更新
    user_mission_login.update(unclaimed_rewards_count: new_login_unclaimed_rewards_count)
    user_mission_playtime.update(unclaimed_rewards_count: new_playtime_unclaimed_rewards_count)
    user_mission_gachaRoll.update(unclaimed_rewards_count: new_gacharoll_unclaimed_rewards_count)

    #jsに渡すデータ作成json・すでにゲットした数と、新しく獲得権を得た数
    loginMission = { newAchiveNum: new_login_unclaimed_rewards_count , alreadyGetted: user_mission_login.progress}
    playtimeMission = { newAchiveNum: new_playtime_unclaimed_rewards_count , alreadyGetted: user_mission_playtime.progress}
    gachaRollMission = { newAchiveNum: new_gacharoll_unclaimed_rewards_count, alreadyGetted: user_mission_gachaRoll.progress }

    Rails.logger.error "loginMission: #{loginMission}"
    Rails.logger.error "playtimeMission: #{playtimeMission}"
    Rails.logger.error "gachaRollMission: #{gachaRollMission}"

    render json: { loginMission: loginMission  ,playtimeMission: playtimeMission ,gachaRollMission: gachaRollMission}
  end
  def all_get_mission_bonus

    user_mission_login = UserMission.find_by(user_id: @user_id , mission_id: 1)
    user_mission_gachaRoll = UserMission.find_by(user_id: @user_id, mission_id: 2)
    user_mission_playtime = UserMission.find_by(user_id: @user_id, mission_id: 3)

    this_login_mission_rewards=MissionReward.find_by( mission_id: 1) #MissionRewardsテーブルからそのミッションのレコード取得
    this_gachaRoll_mission_rewards=MissionReward.find_by( mission_id: 2) #MissionRewardsテーブルからそのミッションのレコード取得
    this_playtime_mission_rewards=MissionReward.find_by( mission_id: 3) #MissionRewardsテーブルからそのミッションのレコード取得

    aimRoom = AimRoom.find_by(user_id: @user_id)#AimRoomテーブルからそのユーザーのレコード取得

    #報酬額の計算
    #login_mission_new_currency = login_mission_get_Currency(user_mission_login.progress, user_mission_login.unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
    login_mission_new_currency = mission_get_Currency(1, user_mission_login.progress, user_mission_login.unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
    gachaRoll_mission_new_currency = mission_get_Currency(2, user_mission_gachaRoll.progress, user_mission_gachaRoll.unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
    playtime_mission_new_currency = mission_get_Currency(3, user_mission_playtime.progress, user_mission_playtime.unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断

    newCurrency = login_mission_new_currency + gachaRoll_mission_new_currency + playtime_mission_new_currency
    now_currency = aimRoom.currency + newCurrency #集計
    aimRoom.update(currency: now_currency) #aimRoomテーヴルのゲーム内通貨currencyを更新
    user_mission.update(progress: user_mission.progress+=1, unclaimed_rewards_count: user_mission.unclaimed_rewards_count-=1) #progressをインクリメント、unclaimed_rewards_countをデクリメントしてテーブル更新

    user_mission_login.update(progress: user_mission_login+user_mission_login.unclaimed_rewards_count, unclaimed_rewards_count:0)
        
    #statusがyetの中から、新たにミッションを達成できてるもの取得し、statusをgettedに上書きし、報酬のクリスタルを増加させ、
    render json: { GettedLoginBonus: now_currency }
  end
  def one_get_mission_bonus

    mission_type_num = params[:mission_type_num] #ミッションのタイプの番号を取得・1.ログイン、2.ガチャ回転数、3.プレイ時間報酬
    user_mission = UserMission.find_by(user_id: @user_id , mission_id: mission_type_num) #UserMission テーブルからuser_idとmission_idで検索したレコードを1件取得
    this_mission_rewards=MissionReward.find_by( mission_id: mission_type_num) #MissionRewardsテーブルからそのミッションのレコード取得
    aimRoom = AimRoom.find_by(user_id: @user_id)#AimRoomテーブルからそのユーザーのレコード取得

    #報酬額の計算
    #login_mission_new_currency = login_mission_get_Currency(user_mission_login.progress, user_mission_login.unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
    new_currency = mission_get_Currency(mission_type_num, user_mission.progress, user_mission.unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
    now_currency = aimRoom.currency + new_currency #集計
    aimRoom.update(currency: now_currency) #aimRoomテーヴルのゲーム内通貨currencyを更新
    user_mission.update(progress: user_mission.progress+=1, unclaimed_rewards_count: user_mission.unclaimed_rewards_count-=1, rewarded: true) #progressをインクリメント、unclaimed_rewards_countをデクリメントしてテーブル更新

    #statusがyetの中から、新たにミッションを達成できてるもの取得し、statusをgettedに上書きし、報酬のクリスタルを増加させ、
    render json: { GettedCurrency: now_currency }
  end
  #def login_mission_get_Currency(progress, unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
  def mission_get_Currency(mission_type_num, progress, unclaimed_rewards_count ,this_mission_rewards) #すでに獲得した数と、獲得権がある数を足して、しきい値と比べて判断
    #ログインボーナスにはしきい値は関係ないけど、ガチャ回した回数ボーナスには関係があるから処理を分ける
    newCurrency=0
    if mission_type_num == 1 #ログインミッションなら
      newCurrency = this_mission_rewards.currency_amount #取得するゲーム内通貨
    elsif mission_type_num == 2 #ガチャ回転ミッションなら
      aimRoom = AimRoom.find_by(user_id: @user_id)#AimRoomテーブルからそのユーザーのレコード取得
      #ガチャの回転数としきい値を比較して報酬額を決定
      #if aimRoom.total_gacha_rolls >= this_mission_rewards.threshold #ガチャ5回
      #if 5 <= aimRoom.total_gacha_rolls && aimRoom.total_gacha_rolls <= 9 #ガチャ5回(9以下)
      #elsif
      #end

      # 変数 a と threshold を比較して、対応する currency_amount を取得
        #例えば：
          #a が 7 の場合、threshold 5 のレコードが選択され、currency_amount 200 が返される
          #a が 15 の場合、threshold 10 のレコードが選択され、currency_amount 500 が返される
        #説明
          #where(mission_id: 2) で mission_id が 2 のレコードをフィルタリング
          #where('threshold <= ?', a) で変数 a 以下の threshold を持つレコードを選択
          #order(threshold: :desc) で threshold の降順にソート（最も近い値を取得するため）
          #first で最初のレコード（最も条件に近い値）を取得
          #&.currency_amount || 0 で該当するレコードがない場合は 0 を返す
        newCurrency = MissionReward.where(mission_id: 2)
          .where('threshold <= ?', aimRoom.total_gacha_rolls)
          .order(threshold: :desc)
          .first
          &.currency_amount || 0
    elsif mission_type_num == 3 #プレイ時間ミッションなら・1日1時間で報酬ゲットを毎日なので固定でおｋ
      newCurrency = this_mission_rewards.currency_amount #取得するゲーム内通貨
    end

    #if user_mission_login.progress + newAchiveNum < this_mission_rewards.threshold #thresholdはしきい値
    if progress + unclaimed_rewards_count <= this_mission_rewards.threshold #thresholdはしきい値
      newCurrency = this_mission_rewards.currency_amount #取得するゲーム内通貨
      Rails.logger.error "login_mission_get_CurrencyのnewCurrency: #{newCurrency}"
    end
    newCurrency
  end
  def LoginMissionClearCheck(todayCompleted,lastLoginDay,unclaimed_rewards_count)
    today = Date.today.strftime('%Y/%m/%d')
    #LastLoginDay = Date.new(2024, 10, 30)
    #newAchiveNum = 0
    if lastLoginDay != today && todayCompleted == false
      unclaimed_rewards_count += 1
      user_mission_login = UserMission.find_by(user_id: @user_id , mission_id: 1)
      user_mission_login.update(completed: true)
    end
    unclaimed_rewards_count
  end
  def GachaMissionClearCheck(total_gacha_rolls,unclaimed_rewards_count,progress)
    #1回回してた場合
    if 5 <= total_gacha_rolls && unclaimed_rewards_count=0 && progress=0
      unclaimed_rewards_count+=1
      Rails.logger.info "ガチャ5回ボーナス発生: total_gacha_rolls:#{total_gacha_rolls}・unclaimed_rewards_count: #{unclaimed_rewards_count}・progress: #{progress}"
    end

    if 10 <= total_gacha_rolls && unclaimed_rewards_count=1 && progress=1
      unclaimed_rewards_count+=1
      Rails.logger.info "ガチャ10回ボーナス発生: total_gacha_rolls:#{total_gacha_rolls}・unclaimed_rewards_count: #{unclaimed_rewards_count}・progress: #{progress}"
    end

    if 15 <= total_gacha_rolls && unclaimed_rewards_count>=2 && progress>=2
      unclaimed_rewards_count+=1
      Rails.logger.info "ガチャ15回ボーナス発生: total_gacha_rolls:#{total_gacha_rolls}・unclaimed_rewards_count: #{unclaimed_rewards_count}・progress: #{progress}"
    end

    unclaimed_rewards_count
  end
  def PlaytimeMissionClearCheck(todayCompleted,daily_play_time,unclaimed_rewards_count)
    if todayCompleted=false && daily_play_time>=30
      unclaimed_rewards_count+=1
      user_mission_playtime = UserMission.find_by(user_id: @user_id, mission_id: 3)
      user_mission_login.uodate(completed: true)
    end
    unclaimed_rewards_count
  end
  def mission_daylly_reset
    Mission.where(reset_frequency: 1).find_each do |mission| 
      #UserMission.where(mission: mission).update_all(progress: 0, completed: false, last_reset_at: Time.current)
      UserMission.where(mission: mission).update_all( completed: false, last_reset_at: Time.current) 
    end
  end 


=begin  
  def self.update_login_bonus(user) 
    mission = Mission.find_by(mission_type: 'login') 
    user_mission = UserMission.find_or_create_by(user: user, mission: mission) 
    if user_mission.last_reset_at.nil? || user_mission.last_reset_at < Date.today 
      user_mission.progress = 1 
      user_mission.completed = true 
      user_mission.last_reset_at = Date.today 
      user_mission.save 
    end 
  end 
  def self.update_playtime_bonus(user, playtime_seconds) 
    mission = Mission.find_by(mission_type: 'playtime') 
    user_mission = UserMission.find_or_create_by(user: user, mission: mission) 
    user_mission.progress += playtime_seconds 
    if user_mission.progress >= mission.required_amount 
      user_mission.completed = true 
    end 
    user_mission.save 
  end 
  def self.update_gacha_bonus(user) 
    mission = Mission.find_by(mission_type: 'gacha') 
    user_mission = UserMission.find_or_create_by(user: user, mission: mission) 
    user_mission.progress += 1 
    if user_mission.progress % 5 == 0 
      user_mission.completed = true 
    end 
    user_mission.save 
  end
  ## 報酬付与ロジック 
  def self.grant_reward(user, mission) 
    user_mission = UserMission.find_by(user: user, mission: mission) 
    return unless user_mission.completed && !user_mission.rewarded 
    reward = MissionReward.find_by(mission: mission, threshold: user_mission.progress) 
    if reward 
      user.user_game_state.currency += reward.currency_amount 
      user.user_game_state.save 
      user_mission.rewarded = true 
      user_mission.save 
    end 
  end
  ## コントローラー実装例 
  #def index 
    #@user_missions = current_user.user_missions.includes(:mission) 
  #end 
  def claim_reward 
    mission = Mission.find(params[:mission_id]) 
    RewardService.grant_reward(current_user, mission) 
    redirect_to missions_path, notice: '報酬を受け取りました！' 
  end 

  ## 定期的なリセット処理 定期的なリセット（例：日次リセット）を行うために、バックグラウンドジョブを使用することをお勧めします。例えば、Sidekiqを使用する場合： 
  # app/jobs/daily_mission_reset_job.rb 
  class DailyMissionResetJob < ApplicationJob 
    queue_as :default 
    def perform 
      Mission.where(reset_frequency: 1).find_each do |mission| 
        UserMission.where(mission: mission).update_all(progress: 0, completed: false, last_reset_at: Time.current) 
      end 
    end 
=end

  private

  def user_item_params
    params.permit(:user_id, :item_id, :quantity, :acquired_at)
  end
end
