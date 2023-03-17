Rails.application.routes.draw do
  root 'top#top'
  get 'user/new_user'
  get 'user/mypage'
  get 'user/account_delete'
  get 'top/top'
end
