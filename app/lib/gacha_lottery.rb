module GachaLottery
  def self.create_table(config)
    table = []
    config.each do |entry|
      non_pick_prob = entry[:prob] *
        entry[:pickups].reduce(1) { |acc, x| acc - x[1] } /
        (entry[:ids].length - entry[:pickups].length)
      
      entry[:ids].each do |cid|
        searched = entry[:pickups].find { |x| x[0] == cid }
        prob = searched ? entry[:prob] * searched[1] : non_pick_prob
        table.push([cid, prob, entry[:rarity]])
      end
    end
    table
  end
 
  def self.normalize(config_like)
    summed = config_like.sum { |x| x[:prob] }
    config_like.map { |entry| entry.merge(prob: entry[:prob] / summed) }
  end
 
  def self.create_table_ceil(conf)
    filtered = normalize(conf.select { |x| x[:rarity] == 5 })
    create_table(filtered)
  end
 
  def self.create_table_rescue(conf)
    filtered = normalize(conf.select { |x| x[:rarity] > 3 })
    create_table(filtered)
  end
 
  def self.gacha_internal(config, user, rval)
    Rails.logger.error "ガconfig: #{config}"
    Rails.logger.error "user: #{user}"
    Rails.logger.error "rval: #{rval}"

    ceil_count = user[:ceil_count] || 0
    table = if ceil_count == 99
              create_table_ceil(config)
            elsif user[:rescue]
              create_table_rescue(config)
            else
              create_table(config)
            end
 
    accum = 0
    table.each do |cid, prob, rarity|
      accum += prob
      return [cid, rarity] if rval < accum
    end
    raise "should not reach here"
  end
 
  def self.gacha(config, user, rval)
    id, rarity = gacha_internal(config, user, rval)
    ceil_count = rarity == 5 ? 0 : user[:ceil_count] + 1
    { id: id, ceil_count: ceil_count }
  end
 
  def self.gacha10(config, user, rvals)
    ids = []
    ceil_count = user[:ceil_count]
    over4 = false
    rvals.each_with_index do |rval, i|
      rescue_flag = i == rvals.length - 1 && !over4
      id, rarity = gacha_internal(config, { ceil_count: ceil_count, rescue: rescue_flag }, rval)
      ceil_count = rarity == 5 ? 0 : ceil_count + 1
      over4 = true if rarity > 3
      ids.push(id)
    end
    { ids: ids, ceil_count: ceil_count }
  end
end