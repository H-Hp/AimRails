
Rails.application.routes.url_helpers

SitemapGenerator::Sitemap.default_host = "https://aim-get.com/" # サイトのホスト名を設定
SitemapGenerator::Sitemap.create do
  add '/', :changefreq => 'always' , :priority => 1.0
  #latest_aim_updated = Aim.order(updated_at: :desc).first
  #add '/', lastmod: latest_aim_updated.updated_at

  
  add '/llm', :changefreq => 'monthly' , :priority => 0.7 , :lastmod => '2023-12-12T10:51:23+09:00'

  latest_playChat_updated = Play.order(created_at: :desc).first
  add '/play', :changefreq => 'monthly' , :priority => 0.7 ,:lastmod => latest_playChat_updated.updated_at
  
  # 各投稿をsitemapに追加する
  Aim.all.each do |aim|
    #add aim_path(aim), lastmod: aim.updated_at
    add aim_path(aim), lastmod: aim.updated_at , :changefreq => 'monthly', :priority => 0.8
  end

end