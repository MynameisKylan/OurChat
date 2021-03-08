Rails.application.routes.draw do
  root 'pages#home'
  resources :conversations, only: %i[index create]
  resources :messages, only: [:create]

  devise_for :users, skip: [:registrations], defaults: { format: :json },
                     controllers: { sessions: 'sessions', registrations: 'registrations' }
  # skip devise registrations and only create the route to create new users - mainly to bypass devise authorization for delete requests
  as :user do
    post '/users', to: 'registrations#create', as: :user_registration
  end
  resource :users, only: %i[show destroy]

  get '*path', to: 'pages#home', via: :all
  mount ActionCable.server => '/cable'
end
