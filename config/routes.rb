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

  get 'terms'  => 'footer#terms'
  #get 'aim/search'
  
  #resources :aim, only: [:new, :create, :edit, :aim, :search]
  resources :aim, only: [:new, :create, :edit, :aim]
  #get 'aim'  =>'aim#aim'
  get '/aim/:id', to: 'aim#aim'
  #get '/search/:id', to: 'aim#search'
  get 'search'  => 'aim#search'
  #get 'create'  =>'aim#create'
  get '/aim/edit/:id'  =>'aim#edit'
  patch '/aim/update/:id', to: 'aim#update'
 
  resources :user, only: [:new, :create, :edit, :aim]
  get 'new_user'  => 'user#new_user'
  get 'mypage'  => 'user#mypage'
  get 'account_delete'  => 'user#account_delete'
  #get 'top'  => 'top#top'
end
