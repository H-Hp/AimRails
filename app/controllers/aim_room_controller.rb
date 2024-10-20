class AimRoomController < ApplicationController

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
  end

  def check_login_status
    data = 'login'
    #data = 'logout'
    if data == 'logout'
      render json: { logged_in: false }
    elsif data == 'login'
      render json: { logged_in: true }
    end
  end

  def check_crystal_amount
    render json: { cristal_amount: 500 }
  end


  def gacha
    gacha_id = params[:gacha_id]

    #DB読込

    #クリスタル消費
    now_Cristal = 500
    #data['Cristal'] = now_Cristal-100

    #アイテムのデータはDBで管理でもいい

    #gacha_idが一致しているものから取得
    #gacha_idが指定された値のアイテムをフィルタリング
    
    #selected_items = $itemData.select { |item| item["gacha_id"] == gacha_id }
    #selected_items = $itemData.select { |item| item["id"] == 2 }.first
    #filtered_data = $itemData.select { |item| item["gacha_id"] == 1 }

    # フィルタリングされたデータからランダムに1つ選びます
    #@result  = filtered_data.sample

    #@result = selected_items.sample
    #@result = $itemData[0]

    @result  = { "id": 8, "gacha_id": 1, "name": "壁紙2", "type": "background", "description": "シンガポール風の背景", "rarity": 25, "max_quantity": 1, "path": "bg2" };


    #アイテムをdbに格納
    myitems = [1,2,3,4,6,13,12,11];
    #myitems.push(@result[:id])
    #myitems.push(3)
    #render json: { item: filtered_data}
    render json: { item: @result }
  end

  def getmyitem
    user_id = params[:user_id]
    #user_idで、$itemDataはアイテムの全データjson、itemsは保有しているアイテムidたちのjson
    myitems = [1,2,3,4,6,13,12,11];
    render json: { myitems: myitems ,itemData: $itemData }
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


end
