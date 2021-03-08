Rails.application.routes.draw do
  root 'pages#home'
  resources :conversations, only: [:index, :create]
  resources :messages, only: [:create]

  devise_for :users, skip: [:registrations], defaults: { format: :json }, controllers: { sessions: 'sessions', registrations: 'registrations' }

  get '*path', to: 'pages#home', via: :all
  mount ActionCable.server => '/cable'
end
