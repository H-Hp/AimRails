module GachaLottery

  #確率テーブル生成
  def self.create_table(config)
    table = []
    config.each do |entry| #レアリティごとの設定をループ

      # ピックアップ以外のアイテムの確率を計算
      # entry[:prob] → このレアリティ全体の確率
      # pickupsのweightを引いて残りを通常アイテムで均等割り
      non_pick_prob = entry[:prob] *
        entry[:pickups].reduce(1) { |acc, x| acc - x[1] } /
        (entry[:ids].length - entry[:pickups].length)
      
      
      entry[:ids].each do |cid| #そのレアリティ内の全アイテムをループ
        searched = entry[:pickups].find { |x| x[0] == cid } #このアイテムがピックアップ対象か探す
        prob = searched ? entry[:prob] * searched[1] : non_pick_prob #ピックアップなら専用確率、違えば通常確率
        table.push([cid, prob, entry[:rarity]])  #[アイテムID, 確率, レアリティ] をテーブルに追加
      end
    end
    table #最終的な「完全確率テーブル」を返す
  end
 
  #確率の正規化・確率の合計を1.0に揃える
  def self.normalize(config_like)
    summed = config_like.sum { |x| x[:prob] } #全確率の合計を計算
    config_like.map { |entry| entry.merge(prob: entry[:prob] / summed) }
  end
 
  #天井用・SSR確定ガチャ
  def self.create_table_ssr_only(conf)
    filtered = normalize(conf.select { |x| x[:rarity] == 5 })
    create_table(filtered)
  end
 
  #10連のSR救済はなし
  #最低保証（SR以上確定）
=begin
  def self.create_table_rescue(conf)
    filtered = normalize(conf.select { |x| x[:rarity] > 3 }) #高レア（>3）だけ残す
    create_table(filtered)
  end
=end
 
  #乱数 + 累積確率で1アイテム抽選
  def self.gacha_internal(config, user, rval,gacha_id)
    Rails.logger.error "user: #{user}"
    Rails.logger.error "rval: #{rval}"
    Rails.logger.error "create_table_ssr_only(config): #{create_table_ssr_only(config)}"
    #Rails.logger.error "create_table_rescue(config): #{create_table_rescue(config)}"
    Rails.logger.error "create_table(config): #{create_table(config)}"

    ceil_count = user[:ceil_count] || 0 #ユーザーの天井カウントを取得（SSR出てない回数）
    total_ssr_count =user[:total_ssr_count] #共通保証の100回天井用
    ceil_count =user[:pickup_ceil_count] #ピックアップの180天井用

    #状態に応じてテーブル切り替え
=begin
    table = if ceil_count == 99 #100回目はSSR確定
              create_table_ceil(config)
            #10連のSR救済はなし
            #elsif user[:rescue] #救済フラグはSR以上確定
              #create_table_rescue(config)
            else
              create_table(config)#通常ガチャ
            end
=end

    #180連天井なら抽選を行わずにそのままピックアップのアイテムidとレアリティを呼び出し元に返す（ピックアップガチャ ID:2)のみ適用
    if gacha_id == 2 && user[:pickup_ceil_count] >= 179
      puts "ピックアップガチャで180連天井なのでピックアップのレアリティ5確定"
      # ソイマール（ID: 12 や 13）のどちらかを確定で返す
      # ここでは例として pickup 配列の最初のキャラを確定とする
      target_id = config.find { |c| c[:rarity] == 5 }[:pickups].first[0]
      return [target_id, 5]
    end

    #100連天井（共通保証のSSR確定)
    if user[:total_ssr_count] >= 99
      puts "total_ssr_countが99なので100連天井（共通保証のSSR確定)・50%でピックアップ獲得"
      # SSRのみのテーブルを作成して抽選
      table = create_table_ssr_only(config)
    else
      puts "通常抽選"
      table = create_table(config)#通常抽選
    end

    #累積確率でアイテムを抽選（ルーレット方式）
    puts "累積確率でアイテムを抽選（ルーレット方式）"
    accum = 0
    table.each do |cid, prob, rarity|
      accum += prob
      puts "cidが#{cid}、probが#{prob}、rarity#{rarity}、accum:#{accum}、rval:#{rval}で、accumにそのアイテムの確立のprobを足して行って、rval < accumになればそのアイテムがゲットするアイテム"
      return [cid, rarity] if rval < accum #乱数がこの範囲に入ったら当選
    end
    raise "ここに到達できない(すべきでない)" #通常ここには来ない（確率合計1前提）
  end
 
  #単発ガチャ
  def self.gacha1(config, user, rval,gacha_id)
    id, rarity = gacha_internal(config, user, rval,gacha_id)# 抽選

    #カウント更新ロジック
    new_total_ssr_count = user[:total_ssr_count] + 1
    new_pickup_ceil_count = user[:pickup_ceil_count] + 1

    # SSRが出たら100連天井はリセット
    new_total_ssr_count = 0 if rarity == 5
    
    # ピックアップアイテムが出たら180連天井はリセット
    new_pickup_ceil_count = 0 if id == 20

    #ceil_count = rarity == 5 ? 0 : user[:ceil_count] + 1 #SSRなら天井リセット、それ以外は+1
    
    { id: id, new_total_ssr_count: new_total_ssr_count, new_pickup_ceil_count:new_pickup_ceil_count } #結果を返す
  end
 
  #10連ガチャ
  def self.gacha10(config, user, rvals)
    ids = []
    ceil_count = user[:ceil_count] #現在の天井カウント
    over4 = false #SR以上が出たかフラグ
    rvals.each_with_index do |rval, i| #10回ループ
      #10連の救済はなし(鈴蘭の剣と同じ)
      #rescue_flag = i == rvals.length - 1 && !over4 #最後の1回 && SR以上出てない → 救済発動
      #id, rarity = gacha_internal(config, { ceil_count: ceil_count, rescue: rescue_flag }, rval) #抽選（救済考慮）
      
      id, rarity = gacha_internal(config, { ceil_count: ceil_count }, rval) #抽選

      ceil_count = rarity == 5 ? 0 : ceil_count + 1 #天井更新
      over4 = true if rarity > 3 # SR以上出たらフラグON
      ids.push(id)  #ガチャ結果の追加
    end
    { ids: ids, ceil_count: ceil_count } #結果を返す
  end
end