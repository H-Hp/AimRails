
Rails.application.routes.url_helpers

SitemapGenerator::Sitemap.default_host = "https://aim-get.com/" # サイトのホスト名を設定
SitemapGenerator::Sitemap.create do
  add '/', :changefreq => 'daily'  # サイト内の各ページを追加
  add '/users/sign_up', :changefreq => 'weekly'
  add '/users/sign_in', :changefreq => 'monthly'

  add '/pricing', :changefreq => 'monthly'
  add '/sctl', :changefreq => 'monthly'
  add '/policy', :changefreq => 'monthly'
  add '/terms', :changefreq => 'monthly'
  add '/contact/new', :changefreq => 'monthly'

  # 各投稿をsitemapに追加する
  Aim.all.each do |aim|
    #add aim_path(aim), lastmod: aim.updated_at
    add aim_path(aim), lastmod: aim.updated_at
  end
end