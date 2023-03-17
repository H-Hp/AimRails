Rails.application.routes.draw do
  root 'top#top'
  get 'query'  => 'footer#query'
  get 'terms'  => 'footer#terms'
  #get 'aim/search'
  get 'search'  => 'aim#search'
  get 'aim'  =>'aim#aim'
  get 'create'  =>'aim#create'
  get 'aim_edit'  =>'aim#edit'
  get 'new_user'  => 'user#new_user'
  get 'mypage'  => 'user#mypage'
  get 'account_delete'  => 'user#account_delete'
  #get 'top'  => 'top#top'
end
