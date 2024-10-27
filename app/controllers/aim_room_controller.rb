class AimRoomController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper

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

  def index
    if user_signed_in?
      # ログイン中の場合の処理
      @login_or_out = 'ログイン中'
      puts "ログイン中";Rails.logger.error "ログイン中"
    else
      # ログインしていない場合の処理
      @login_or_out = 'ログアウト中'
      puts "ログアウト中";Rails.logger.error "ログアウト中"
    end

  end

  def resolve_path
    original_paths = params[:paths]
    Rails.logger.error "original_paths: #{original_paths}"
    #my_items_path_array = original_paths.pluck(:path)
    resolved_paths=[]
    original_paths.each do |path|
      #resolved_paths.push(helpers.asset_path(path))
      resolved_paths.push(helpers.asset_path("aimroom/item/"+path+".png"))
    end
    Rails.logger.error "resolved_paths: #{resolved_paths}"
    render json: { resolved_paths: resolved_paths }
=begin
    original_path = params[:path]
    resolved_path = helpers.asset_path(original_path)
    #resolved_path = helpers.asset_path('aimroom/shop.png')
    Rails.logger.error "resolved_path: #{resolved_path}"
    #render json: { original_path: original_path, resolved_path: resolved_path }
    render json: { resolved_path: resolved_path }
=end
  end

  def check_login_status
    if user_signed_in?
      render json: { logged_in: true }
    else
      render json: { logged_in: false }
    end
  end

  def check_crystal_amount
    @AimRoom = AimRoom.find_by(user_id: current_user.id)
    puts "@AimRoom.currency: #{@AimRoom.currency}";Rails.logger.error "@AimRoom.currency: #{@AimRoom.currency}"
    render json: { cristal_amount: @AimRoom.currency }
    #render json: { cristal_amount: 500 }
  end


  def gacha
    @gacha_id = params[:gacha_id]
    Rails.logger.error "ガガガチャロロロロログ:gacha_id： #{@gacha_id}"
    @gacha = Gacha.find_by(id: @gacha_id)
    #@gacha = Gacha.find_by(id: params[:gacha_id])
    #@gacha = Gacha.find_by(id: 1)
    #@gacha = Gacha.find(1) 

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
    #config = GachaConfig.get_config
    config = GachaConfig.get_config(@gacha_id)
    #random_number = rand(0.005..1.0)#0.005から1までのランダムな小数を生成
    #random_number = ((rand * 0.995) + 0.005).round(3)# 0.005~1の範囲で乱数を生成し、小数点以下3桁までに丸める
    #possible_values = [0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9] # 可能な値を配列で定義
    possible_values = [0.005, 0.04, 0.7] # 可能な値を配列で定義
    random_number = possible_values.sample# ランダムに1つ選択
    @get_item=GachaLottery.gacha(config, { ceil_count: 40 }, random_number)
    Rails.logger.error "ガガガチャロロロロログ:random_number： #{random_number}"
    Rails.logger.error "当たったget_items： #{@get_item}"
    #data = master.find { |item| item[:id] == 3 }# idが3のデータを探し出す
    #当たったアイテムidからデータを持ってくる
    @get_item_data = Item.find { |item| item[:id] == @get_item[:id] }# idが3のデータを探し出す
    Rails.logger.error "アイテムのデータ #{@get_item_data}"

    #クリスタル消費
    aimRoom = AimRoom.find_by(user_id: current_user.id)
    now_Cristal = aimRoom.currency - @gacha.cost
    aimRoom.update(currency: now_Cristal)

    #アイテムをdbに格納
    user_item = UserItem.find_by(user_id: current_user.id, item_id: @get_item_data.id)
    #if UserItem.exists?(user_id: current_user.id, item_id: @get_item_data.id)
    #if (UserItem.find_by(user_id: current_user.id,item_id: @get_item_data.id)){
    if user_item
      user_item.increment!(:quantity)
      #UserItem.find_by(user_id: current_user.id, item_id: @get_item_data.id).increment!(:quantity)
      #UserItem.update(quantity: )
      puts "Quantity incremented!"
    else
      @quantity=1
      @userItem = UserItem.new(user_id: current_user.id, item_id: @get_item_data.id, quantity: @quantity, acquired_at: Time.current)
      #@userItem = UserItem.new(user_id: current_user.id, item_id: @get_item_data.id, acquired_at: Time.current)
      @userItem.save
      #@userItem = UserItem.create!(user_id: 1,item_id: 11,quantity: 1,acquired_at: Time.current)
      puts "Record not found!"
    end
    #render json: { item: @result }
    render json: { item: @get_item_data }
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
    render json: { itemData: @owned_items }
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
    json_path = Rails.root.join('public', 'data.json')
    data = JSON.parse(File.read(json_path))
    newAchiveNum = LoginBonusCheck(data['LastLoginDay'])

    #statusがyetの中から新たにミッションを達成できてる数を取得し、その数を返す
=begin
    lastLoginDate = data['lastLoginDate']
    #lastLoginDate = localStorage.getItem('lastLoginDate') 
    today = new Date().toDateString() 
    # 今日の日付を取得
    today = Date.today
=end
    render json: { login: newAchiveNum ,GettedLoginBonus: data['GettedLoginBonus'],longstay: '1' }
  end
  def all_get_mission_bonus
    longinBonusNewAchiveNum = params[:longinBonusNewAchiveNum]
    longstayBonusNewAchiveNum = params[:longstayBonusNewAchiveNum]

    #lastLoginDay = data['LastLoginDay']
    #newAchiveNum = LoginBonusCheck(lastLoginDay)
    data['GettedLoginBonus'] = data['GettedLoginBonus']+longinBonusNewAchiveNum
    data['Cristal'] = data['Cristal']+50
    File.write(json_path, JSON.pretty_generate(data))
    #statusがyetの中から、新たにミッションを達成できてるもの取得し、statusをgettedに上書きし、報酬のクリスタルを増加させ、
    render json: { GettedLoginBonus: data['GettedLoginBonus'] ,longstay: longstayBonusNewAchiveNum }
  end

  def one_get_mission_bonus
    longinBonusNewAchiveNum = params[:longinBonusNewAchiveNum]
    longstayBonusNewAchiveNum = params[:longstayBonusNewAchiveNum]
    json_path = Rails.root.join('public', 'data.json')
    data = JSON.parse(File.read(json_path))
    #lastLoginDay = data['LastLoginDay']
    #newAchiveNum = LoginBonusCheck(lastLoginDay)
    data['GettedLoginBonus'] = data['GettedLoginBonus']+longinBonusNewAchiveNum
    data['Cristal'] = data['Cristal']+50
    File.write(json_path, JSON.pretty_generate(data))
    #statusがyetの中から、新たにミッションを達成できてるもの取得し、statusをgettedに上書きし、報酬のクリスタルを増加させ、
    render json: { GettedLoginBonus: data['GettedLoginBonus'] ,longstay: longstayBonusNewAchiveNum }
  end
  def LoginBonusCheck(lastLoginDay)
    today = Date.today.strftime('%Y/%m/%d')
    #LastLoginDay = Date.new(2024, 10, 30)
    newAchiveNum = 0
    if lastLoginDay != today
      #this.awardDailyBonus()
      #localStorage.setItem('lastLoginDate', today) 
      newAchiveNum = 1
    end
    newAchiveNum
  end

  private

  def user_item_params
    params.permit(:user_id, :item_id, :quantity, :acquired_at)
  end
end
