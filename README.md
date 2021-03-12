# OurChat

Live on [Heroku](https://our-chat-mynameiskylan.herokuapp.com).

A messenger clone utilizing Rails' websockets framework - ActionCable. Users can create an account and create conversations with zero or more other users. Messaging is broadcast via the pub/sub model of websockets. Authentication is handled by [Devise](https://github.com/heartcombo/devise). Authorization is implemented with JSON web tokens and distributed via HTTP-only cookies.

Front-End:
- ReactJS
- JSX
- CSS

Back-End:
- Rails
