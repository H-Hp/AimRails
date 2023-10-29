Rails.application.routes.draw do

  #devise_for :users
  devise_for :users, controllers: {       # ← 恐らく最初は”devise_for:”のみの記載かと
    registrations: "users/registrations",
    confirmations: "users/confirmations"
  }
  get 'user/regist_after' => 'user#regist_after'

  root 'top#top'
  get '/'  => 'top#top'
  
  
  resources :contact, only: [:new, :create]

  get 'pricing'  => 'footer#pricing'
  get 'business'  => 'footer#business'
  get 'sctl'  => 'footer#sctl'
  get 'policy'  => 'footer#policy'
  get 'terms'  => 'footer#terms'
  #get 'aim/search'
  
  #resources :aim, only: [:new, :create, :edit, :aim, :search]
  resources :aim, only: [:new, :create, :edit, :aim]
  
  #get 'aim'  =>'aim#aim'
  #get '/search/:id', to: 'aim#search'
  #get 'create'  =>'aim#create'

  get '/aim/:id', to: 'aim#aim',as: 'aim'
  get 'search'  => 'aim#search'
  get '/aim/edit/:id'  =>'aim#edit'
  patch '/aim/update/:id', to: 'aim#update'
 
  resources :user, only: [:new, :create, :edit, :aim]
  get 'new_user'  => 'user#new_user'
  get 'mypage'  => 'user#mypage'
  get 'account_delete'  => 'user#account_delete'
  #get 'top'  => 'top#top'

  get 'mypage'  => 'user#mypage'

  resources :notifications, only: :index
end
