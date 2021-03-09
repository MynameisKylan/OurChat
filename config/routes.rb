Rails.application.routes.draw do
  root 'pages#home'

  devise_for :users, skip: [:registrations], defaults: { format: :json },
                     controllers: { sessions: 'sessions', registrations: 'registrations' }
  # skip devise registrations and only create the route to create new users - mainly to bypass devise authorization for delete requests
  as :user do
    post '/users', to: 'registrations#create', as: :user_registration
  end
  resource :users, only: %i[show destroy]

  resource :conversations, only: [:get_all, :create] do
    get 'get_all', on: :member
  end
  resources :messages, only: [:create]

  get '*path', to: 'pages#home', via: :all
  mount ActionCable.server => '/cable'
end
