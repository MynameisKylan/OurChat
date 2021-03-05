Rails.application.routes.draw do
  root 'pages#home'
  resources :conversations, only: [:index, :create]
  resources :messages, only: [:create]

  get '*path', to: 'pages#home', via: :all
end
