Rails.application.routes.draw do

  root 'top#top'
  get '/'  => 'top#top'
  
  resources :contact, only: [:new, :create]

  get 'terms'  => 'footer#terms'
  #get 'aim/search'
  
  
  resources :aim, only: [:new, :create, :edit, :aim, :search]
  #get 'aim'  =>'aim#aim'
  #get 'create'  =>'aim#create'
  #get 'aim_edit'  =>'aim#edit'
  #get 'search'  => 'aim#search'

  get 'new_user'  => 'user#new_user'
  get 'mypage'  => 'user#mypage'
  get 'account_delete'  => 'user#account_delete'
  #get 'top'  => 'top#top'
end
