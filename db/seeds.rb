# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

users = User.create([{ username: 'kylan', password: 'password', password_confirmation: 'password', email: 'kylan@mail.com' },
                     { username: 'alex', password: 'password', password_confirmation: 'password',
                       email: 'alex@mail.com' }])

conversations = Conversation.create([{ title: 'number 1' }, { title: 'number 2' }])

memberships = Membership.create([{user_id: 1, conversation_id: 1}, {user_id: 1, conversation_id: 2}, {user_id: 2, conversation_id: 1}])

messages = Message.create([{ conversation_id: 1, text: 'hello to 1', user_id: 1 }, { conversation_id: 1, text: 'hello again', user_id: 1 }, { conversation_id: 2, text: 'hello to 2', user_id: 2 }])
