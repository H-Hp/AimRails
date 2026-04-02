module GachaConfig
  extend ActiveSupport::Concern
=begin
  class << self
    def get_config(gacha_id)  # gacha_idを引数として追加
      {
        gacha_id: gacha_id
      }
    end

  def self.rarity_of(master, id)
    me = master.find { |x| x[:id] == id }
    return me[:rarity] if me
    raise "no such ID is found: #{id}"
  end

  def self.rarity_of(master, id)
    item = master.find { |x| x[:id] == id }
    item ? item[:rarity] : nil
  end
=end
 
  #指定したitem_idでItemテーブルから「レアリティ」を取得するメソッド
  def self.rarity_of(master, id)
    item = master.find { |x| x[:id] == id } #master配列（全アイテム）からidが一致するアイテムを1件探す・例: { id: 1, rarity: 3, ... }
    item ? item[:rarity] : nil #itemが見つかった場合そのアイテムのレアリティを返す・見つからなければnilを返す
  end

  #ItemテーブルやGachaテーブルのデータを取得しガチャロジックで使いやすい形に変換
  def self.get_data_from_db(gacha_id)
    @gacha = Gacha.find_by(id: gacha_id) #指定されたgacha_idのガチャレコードを取得

    # 恒常ガチャはpickupの値を0にしているので、pickupカラムが0やnilの場合は空配列[]に変換する
    raw_pickup = @gacha.pickup
    processed_pickup = (raw_pickup == 0 || raw_pickup.nil?) ? [] : raw_pickup.to_a

    info = { 
      weights: @gacha.weights.to_a, #レアリティごとの排出確率・例: { "1" => 0.8, "2" => 0.15, "3" => 0.05 }・to_aで [["1",0.8],["2",0.15]...] の配列に変換
      pickup: processed_pickup.to_a    #ピックアップ情報・例: [[item_id, weight], [item_id, weight]]・これも配列形式に変換
    }

    # 指定ガチャIDのアイテムと ＋ ガチャIDが1の他の全てのアイテムを取得
    master = Item.where(gacha_id: [gacha_id, 1]).map do |item|
    #master = Item.where(gacha_id: gacha_id).map do |item| #itemsテーブルから「このガチャに属するアイテム」を全取得
      {
        id: item.id,
        gacha_id: item.gacha_id,
        rarity: item.rarity,
        #name: item.name,
        #item_type: item.item_type,
        #description: item.description,
        #key: item.key
      }
    end

    #rarityを数値に変換・DBやJSONだと文字列になっている可能性があるため・後続処理で比較しやすいように整数に統一
    master = master.map do |item|
      item.merge(rarity: item[:rarity].to_i)
    end

    Rails.logger.error "ガ@gacha.weightsガチャロロロロログ:@gacha.weights #{@gacha.weights}"
    Rails.logger.error "ガ@gacha.pickupガチャロロロロログ:@gacha.pickup  #{@gacha.pickup }"
    Rails.logger.error "ガガmasterガチャロロロロログ:master #{master}"
    
    [info, master] #info（設定）とmaster（アイテム一覧）を返す
  end
=begin
    #master = Item.all()
    #master2 = Item.find_by(gacha_id: 1)
    #master = Item.where(gacha_id: 1)
    #master = item.formatted_for_master
    #master = Item.formatted_for_master
    #master = Item.where(gacha_id: 1).map do |item|

    #master_json = master2.to_json
    #master = JSON.parse(master_json, symbolize_names: true)

    #master = master2.map do |item|
    #  item.transform_keys(&:to_sym)
    #end
=end
=begin   
  config: [{:rarity=>6, :prob=>0.01, :pickups=>[], :ids=>[]}, {:rarity=>7, :prob=>0.1, :pickups=>[], :ids=>[]}, {:rarity=>8, :prob=>0.89, :pickups=>[], :ids=>[]}]
  user: {:ceil_count=>40}
  rval: 0.005

  config: [{:rarity=>5, :prob=>0.01, :pickups=>[[6, 0.4], [7, 0.4]], :ids=>[6, 7]}, {:rarity=>4, :prob=>0.1, :pickups=>[[8, 0.1]], :ids=>[8, 9]}, {:rarity=>3, :prob=>0.89, :pickups=>[], :ids=>[10, 11, 1007]}]
  user: {:ceil_count=>40}
  rval: 0.005
  ガガガチャロロロロログ:@single_results： [{:id=>7, :ceil_count=>0}, {:id=>9, :ceil_count=>41}, {:id=>11, :ceil_count=>41}, {:id=>7, :ceil_count=>0}]
  当たったget_items： {:id=>7, :ceil_count=>0}

  master = [
        { id: 6, gacha_id: 1, name: 'まあ元気出せよ', type: 'obj' , description: '辛いときに響く言葉' ,rarity: 5 ,max_quantity: 1 ,path: 'obj1'},
        { id: 7, gacha_id: 1, name: '壁紙1', type: 'background' , description: 'アラブ風の背景' ,rarity: 5 ,max_quantity: 1 ,path: 'bg1'},
        { id: 8, gacha_id: 1, name: '壁紙2', type: 'background' , description: 'シンガポール風の背景' ,rarity: 4 ,max_quantity: 1 ,path: 'bg2'},
        { id: 9, gacha_id: 1, name: '時計', type: 'obj' , description: 'シンプルな時計' ,rarity: 4 ,max_quantity: 1 ,path: 'obj2'},
        { id: 10, gacha_id: 1, name: '猫1', type: 'obj' , description: '白い猫' ,rarity: 3 ,max_quantity: 1 ,path: 'obj3'},
        { id: 11, gacha_id: 1, name: 'キャラ1', type: 'chara' , description: 'ロングヘアーの女の子' ,rarity: 3 ,max_quantity: 1 ,path: 'chara1'},
        { id: 1007, gacha_id: 2, name: '音楽1', type: 'music' , description: '洋風の音楽' ,rarity: 3 ,max_quantity: 1 ,path: 'music1'}
      ];

      [{"id":11,"gacha_id":1,"name":"キャラ1","item_type":"chara","description":"ロングヘアーの女の子","rarity":"1","max_quantity":1,"path":"chara1","properties":{},"created_at":"2024-10-23T04:27:53.398Z","updated_at":"2024-10-23T04:27:53.398Z"},{"id":6,"gacha_id":1,"name":"まあ元気出せよ","item_type":"obj","description":"辛いときに響く言葉","rarity":"5","max_quantity":1,"path":"obj1","properties":{},"created_at":"2024-10-23T04:27:53.398Z","updated_at":"2024-10-23T04:27:53.398Z"},{"id":7,"gacha_id":1,"name":"壁紙1","item_type":"background","description":"アラブ風の背景","rarity":"5","max_quantity":1,"path":"bg1","properties":{},"created_at":"2024-10-23T04:27:53.398Z","updated_at":"2024-10-23T04:27:53.398Z"},{"id":8,"gacha_id":1,"name":"壁紙2","item_type":"background","description":"シンガポール風の背景","rarity":"4","max_quantity":1,"path":"bg2","properties":{},"created_at":"2024-10-23T04:27:53.398Z","updated_at":"2024-10-23T04:27:53.398Z"},{"id":9,"gacha_id":1,"name":"時計","item_type":"obj","description":"シンプルな時計","rarity":"3","max_quantity":1,"path":"obj2","properties":{},"created_at":"2024-10-23T04:27:53.398Z","updated_at":"2024-10-23T04:27:53.398Z"},{"id":10,"gacha_id":1,"name":"猫1","item_type":"obj","description":"白い猫","rarity":"2","max_quantity":1,"path":"obj3","properties":{},"created_at":"2024-10-23T04:27:53.398Z","updated_at":"2024-10-23T04:27:53.398Z"}]

      master = Item.where(gacha_id: 1).map do |item|
        {
          id: item.id,
          gacha_id: item.gacha_id,
          name: item.name,
          type: item.item_type,
          description: item.description,
          rarity: item.rarity,
          max_quantity: item.max_quantity,
          path: item.path
        }
      end
      formatted_master = master.map do |item|
        {
          id: item[:id],
          gacha_id: item[:gacha_id],
          name: item[:name],
          type: item[:type],
          description: item[:description],
          rarity: item[:rarity].to_i,  # 文字列から数値に変換
          max_quantity: item[:max_quantity],
          path: item[:path]
        }
      end

      transformed_data = master.map.with_index(1) do |item, index|
        {
          id: index,
          gacha_id: item[:gacha_id],
          name: item[:name],
          type: item[:type],
          description: item[:description],
          rarity: item[:rarity].to_i,
          max_quantity: item[:max_quantity],
          path: item[:path]
        }
      end

      # Add the additional item for gacha_id 2
      transformed_data << {
        id: 1007,
        gacha_id: 2,
        name: '音楽1',
        type: 'music',
        description: '洋風の音楽',
        rarity: 1,
        max_quantity: 1,
        path: 'music1'
      }

      master = [
        { id: 1, gacha_id: 1, name: 'まあ元気出せよ', type: 'obj' , description: '辛いときに響く言葉' ,rarity: 5 ,max_quantity: 1 ,path: 'obj1'},
        { id: 2, gacha_id: 1, name: '壁紙1', type: 'background' , description: 'アラブ風の背景' ,rarity: 5 ,max_quantity: 1 ,path: 'bg1'},
        { id: 3, gacha_id: 1, name: '壁紙2', type: 'background' , description: 'シンガポール風の背景' ,rarity: 4 ,max_quantity: 1 ,path: 'bg2'},
        { id: 4, gacha_id: 1, name: '時計', type: 'obj' , description: 'シンプルな時計' ,rarity: 3 ,max_quantity: 1 ,path: 'obj2'},
        { id: 5, gacha_id: 1, name: '猫1', type: 'obj' , description: '白い猫' ,rarity: 2 ,max_quantity: 1 ,path: 'obj3'},
        { id: 6, gacha_id: 1, name: 'キャラ1', type: 'chara' , description: 'ロングヘアーの女の子' ,rarity: 1 ,max_quantity: 1 ,path: 'chara1'},
        { id: 1007, gacha_id: 2, name: '音楽1', type: 'music' , description: '洋風の音楽' ,rarity: 1 ,max_quantity: 1 ,path: 'music1'}
      ];


        master = [
        { id: 1, gacha_id: 1, name: 'まあ元気出せよ', type: 'obj' , description: '辛いときに響く言葉' ,rarity: 5 ,max_quantity: 1 ,path: 'obj1'},
        { id: 2, gacha_id: 1, name: '壁紙1', type: 'background' , description: 'アラブ風の背景' ,rarity: 5 ,max_quantity: 1 ,path: 'bg1'},
        { id: 5, gacha_id: 1, name: '壁紙2', type: 'background' , description: 'シンガポール風の背景' ,rarity: 4 ,max_quantity: 1 ,path: 'bg2'},
        { id: 6, gacha_id: 1, name: '時計', type: 'obj' , description: 'シンプルな時計' ,rarity: 3 ,max_quantity: 1 ,path: 'obj2'},
        { id: 7, gacha_id: 1, name: '猫1', type: 'obj' , description: '白い猫' ,rarity: 2 ,max_quantity: 1 ,path: 'obj3'},
        { id: 8, gacha_id: 1, name: 'キャラ1', type: 'chara' , description: 'ロングヘアーの女の子' ,rarity: 1 ,max_quantity: 1 ,path: 'chara1'},
        { id: 1007, gacha_id: 2, name: '音楽1', type: 'music' , description: '洋風の音楽' ,rarity: 1 ,max_quantity: 1 ,path: 'music1'}
      ]; 
      
      # data for gacha
      info = {
        # レアリティごとの重み（出現確率）・レアリティと出現確率のセット表
        weights: [[5, 0.01], [4, 0.1], [3, 0.89]],
        pickup: [[1, 0.4], [2, 0.4], [3, 0.1]]
      }
      info = {
        # レアリティごとの重み（出現確率）・レアリティと出現確率のセット表
        weights: [[5, 0.01], [4, 0.1], [3, 0.89]],
        #pickup: [['5001', 0.4], ['5002', 0.4], ['4001', 0.1]]
        pickup: [[1, 0.4], [2, 0.4], [3, 0.1]]
        pickup: [[5, 0.5], [6, 0.3], [7, 0.3], [8, 0.3]]
      }

      info = { 
        weights: JSON.parse(@gacha.weights),
        pickup: JSON.parse(@gacha.pickup)
      }
      info = { 
        weights: @gacha.formatted_weights,
        pickup: @gacha.formatted_pickup
      }

      master = [
        { id: 1, gacha_id: 1, name: 'まあ元気出せよ', type: 'obj' , description: '辛いときに響く言葉' ,rarity: 5 ,max_quantity: 1 ,path: 'obj1'},
        { id: 2, gacha_id: 1, name: '壁紙1', type: 'background' , description: 'アラブ風の背景' ,rarity: 5 ,max_quantity: 1 ,path: 'bg1'},
        { id: 3, gacha_id: 1, name: '壁紙2', type: 'background' , description: 'シンガポール風の背景' ,rarity: 4 ,max_quantity: 1 ,path: 'bg2'},
        { id: 4, gacha_id: 1, name: '時計', type: 'obj' , description: 'シンプルな時計' ,rarity: 3 ,max_quantity: 1 ,path: 'obj2'},
        { id: 5, gacha_id: 1, name: '猫1', type: 'obj' , description: '白い猫' ,rarity: 2 ,max_quantity: 1 ,path: 'obj3'},
        { id: 6, gacha_id: 1, name: 'キャラ1', type: 'chara' , description: 'ロングヘアーの女の子' ,rarity: 1 ,max_quantity: 1 ,path: 'chara1'},
        { id: 1007, gacha_id: 2, name: '音楽1', type: 'music' , description: '洋風の音楽' ,rarity: 1 ,max_quantity: 1 ,path: 'music1'}
      ];

      [
      {:id=>1,
      :gacha_id=>0, :name=>"デフォ壁紙", :type=>"background", :description=>"デフォルトの壁紙", :rarity=>"0", :max_quantity=>1, :path=>"bg0"}, {:id=>2, :gacha_id=>0, :name=>"デフォキャラ", :type=>"chara", :description=>"デフォルトの壁紙", :rarity=>"0", :max_quantity=>1, :path=>"chara0"}, {:id=>3, :gacha_id=>0, :name=>"デフォ机", :type=>"desk", :description=>"デフォルトの机", :rarity=>"0", :max_quantity=>1, :path=>"desk0"}, {:id=>4, :gacha_id=>0, :name=>"しずかな音楽", :type=>"music", :description=>"デフォルトの音楽1", :rarity=>"0", :max_quantity=>1, :path=>"music01"}, {:id=>5, :gacha_id=>0, :name=>"シャイニングスター", :type=>"music", :description=>"デフォルトの音楽2", :rarity=>"0", :max_quantity=>1, :path=>"music02"}, {:id=>11, :gacha_id=>1, :name=>"キャラ1", :type=>"chara", :description=>"ロングヘアーの女の子", :rarity=>"1", :max_quantity=>1, :path=>"chara1"}, {:id=>12, :gacha_id=>2, :name=>"音楽1", :type=>"music", :description=>"洋風の音楽", :rarity=>"2", :max_quantity=>1, :path=>"music1"}, {:id=>13, :gacha_id=>2, :name=>"机", :type=>"desk", :description=>"おしゃれな机", :rarity=>"3", :max_quantity=>1, :path=>"desk1"}, {:id=>6, :gacha_id=>1, :name=>"まあ元気出せよ", :type=>"obj", :description=>"辛いときに響く言葉", :rarity=>"5", :max_quantity=>1, :path=>"obj1"}, {:id=>7, :gacha_id=>1, :name=>"壁紙1", :type=>"background", :description=>"アラブ風の背景", :rarity=>"5", :max_quantity=>1, :path=>"bg1"}, {:id=>8, :gacha_id=>1, :name=>"壁紙2", :type=>"background", :description=>"シンガポール風の背景", :rarity=>"4", :max_quantity=>1, :path=>"bg2"}, {:id=>9, :gacha_id=>1, :name=>"時計", :type=>"obj", :description=>"シンプルな時計", :rarity=>"3", :max_quantity=>1, :path=>"obj2"}, {:id=>10, :gacha_id=>1, :name=>"猫1", :type=>"obj", :description=>"白い猫", :rarity=>"2", :max_quantity=>1, :path=>"obj3"}]
  =end
  =begin
      master = [
        { id: '5001', gacha_id: 1, name: 'まあ元気出せよ', type: 'obj' , description: '辛いときに響く言葉' ,rarity: 5 ,max_quantity: 1 ,path: 'obj1'},
        { id: '5002', gacha_id: 1, name: '壁紙1', type: 'background' , description: 'アラブ風の背景' ,rarity: 5 ,max_quantity: 1 ,path: 'bg1'},
        { id: '5003', gacha_id: 1, name: '壁紙2', type: 'background' , description: 'シンガポール風の背景' ,rarity: 4 ,max_quantity: 1 ,path: 'bg2'},
        { id: '5004', gacha_id: 1, name: '時計', type: 'obj' , description: 'シンプルな時計' ,rarity: 3 ,max_quantity: 1 ,path: 'obj2'},
        { id: '5005', gacha_id: 1, name: '猫1', type: 'obj' , description: '白い猫' ,rarity: 2 ,max_quantity: 1 ,path: 'obj3'},
        { id: '4001', gacha_id: 1, name: 'キャラ1', type: 'chara' , description: 'ロングヘアーの女の子' ,rarity: 1 ,max_quantity: 1 ,path: 'chara1'},
        { id: '5007', gacha_id: 2, name: '音楽1', type: 'music' , description: '洋風の音楽' ,rarity: 1 ,max_quantity: 1 ,path: 'music1'}
      ];

      # data for character
      master = [
        { id: '5001', rarity: 5 }, # other attributes are omitted
        { id: '5002', rarity: 5 },
        { id: '5003', rarity: 5 },
        { id: '4001', rarity: 4 },
        { id: '4002', rarity: 4 },
        { id: '4003', rarity: 4 },
        { id: '3001', rarity: 3 },
        { id: '3002', rarity: 3 },
        { id: '3003', rarity: 3 }
      ]
=end 
=begin
  def self.get_config
    config = []
    info, master = get_data_from_db
    info[:weights].each do |rarity, prob|
      ids = master.select { |x| x[:rarity] == rarity }.map { |x| x[:id] }
      pickups = info[:pickup].select { |x| rarity_of(master, x[0]) == rarity }
      config.push({ rarity: rarity, prob: prob, pickups: pickups, ids: ids })
    end
    Rails.logger.error "ガconfig: #{config}"
    config
  end
=end

  #ガチャの「確率テーブル生成」ロジック
  def self.get_config(gacha_id)
    config = [] # 最終的に返す「ガチャ設定配列」
    #info, master = get_data_from_db
    info, master = get_data_from_db(gacha_id) #DBからガチャ情報とマスタデータを取得・info:確率/ピックアップ情報・master:全アイテム一覧
    info[:weights].each do |rarity, prob| #レアリティごとの確率をループ・例:{ "SSR" => 0.01, "SR" => 0.1, "R" => 0.89 }
      #Rails.logger.error "rarity: #{rarity}"
      #Rails.logger.error "prob: #{prob}"
      rarity = rarity.to_i #intに変換
      ids = master.select { |x| x[:rarity] == rarity }.map { |x| x[:id] } #該当レアリティのアイテムID一覧を取得・masterからrarityが一致するものだけ抽出してidだけ取り出す
      pickups = info[:pickup].select { |x| rarity_of(master, x[0]) == rarity } #ピックアップ対象の中から「このレアリティのものだけ」抽出・info[:pickup] は [item_id, weight] の配列想定
      config.push({ rarity: rarity, prob: prob, pickups: pickups, ids: ids })# 最終的な設定を1つのハッシュとして追加・rarity:レアリティ・prob:そのレアリティの排出確率・pickups:ピックアップ対象（このレアリティのもの）・ids:このレアリティに属する全アイテムID
    end
    config
  end

end