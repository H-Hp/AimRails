
Rails.application.routes.url_helpers

SitemapGenerator::Sitemap.default_host = "https://aim-get.com/" # サイトのホスト名を設定
SitemapGenerator::Sitemap.create do
  add '/', :changefreq => 'always' , :priority => 1.0
  #latest_aim_updated = Aim.order(updated_at: :desc).first
  #add '/', lastmod: latest_aim_updated.updated_at

  
  add '/llm', :changefreq => 'monthly' , :priority => 0.7 , :lastmod => '2023-12-12T10:51:23+09:00'

  latest_playChat_created_at = Play.order(created_at: :desc).first
  add '/play', :changefreq => 'monthly' , :priority => 0.7 ,:lastmod => latest_playChat_created_at.created_at
  
  # 各投稿をsitemapに追加する
  Aim.all.each do |aim|
    #add aim_path(aim), lastmod: aim.updated_at
    add aim_path(aim), lastmod: aim.updated_at , :changefreq => 'monthly', :priority => 0.8
  end

  # 除外するページを指定
  #except contact_path
  #except about_path
  #except privacy_path
=begin
  except '/users*'   # ワイルドカードでもOK
  except '/pricing'
  except '/sctl'
  except '/policy'
  except '/terms'
  except '/contact*'
  except '/pricing'
=end
end