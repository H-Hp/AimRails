Rails.application.routes.draw do

  #devise_for :users
  devise_for :users, controllers: {       # ← 恐らく最初は”devise_for:”のみの記載かと
    registrations: "users/registrations",
    confirmations: "users/confirmations"
  }, skip: :confirmations
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
  post '/aim/delete/:id', to: 'aim#delete'
 
  resources :user, only: [:new, :create, :edit, :aim]
  get 'new_user'  => 'user#new_user'
  get 'mypage'  => 'user#mypage'
  get 'account_delete'  => 'user#account_delete'
  #get 'top'  => 'top#top'

  #get 'mypage'  => 'user#mypage'
  get '/user/:username', to: 'user#mypage'
  
  #resources :setting, only: [:update_password]
  get 'setting'  => 'setting#setting_page'
  post '/setting/update_mail/:id', to: 'setting#update_mail'
  post '/setting/update_username/:id', to: 'setting#update_username'
  post '/setting/update_password/:id', to: 'setting#update_password'
  patch '/setting/update_password/:id', to: 'setting#update_password'
  post '/setting/delete_user/:id', to: 'setting#delete_user'

  post '/setting/icon_type_change/:id', to: 'setting#icon_type_change'
  get '/setting/user/custom_img'  => 'setting#custom_img'
  post '/setting/upload_img/:id', to: 'setting#upload_img'

  #resources :notifications, only: [:index, :new, :create, :check]
  resources :notifications, only: [:index, :new ,:create]
  patch '/notifications/check', to: 'notifications#check'
  post '/notifications/check', to: 'notifications#check'
  #post '/notifications/create/', to: 'notifications#create'
end
