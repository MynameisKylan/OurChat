# OurChat

Live [Demo](https://our-chat.fly.dev/conversations).

A messenger clone utilizing Rails' websockets framework - [ActionCable](https://guides.rubyonrails.org/action_cable_overview.html). Users can create an account and create conversations with zero or more other users. Messaging is broadcast via the pub/sub model of websockets. Authentication is handled by [Devise](https://github.com/heartcombo/devise). Authorization is implemented with JSON web tokens and distributed via HTTP-only cookies.

Front-End:
- ReactJS
- JSX
- CSS

Back-End:
- Rails
