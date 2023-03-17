Rails.application.routes.draw do
  get 'aim/search'
  get 'aim/aim'
  get 'aim/create'
  get 'aim/edit'
  root 'top#top'
  get 'user/new_user'
  get 'user/mypage'
  get 'user/account_delete'
  get 'top/top'
end
