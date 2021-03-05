# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

conversations = Conversation.create([{ title: 'number 1' }, { title: 'number 2' }])

messages = Message.create([{conversation_id: 1, text: 'hello to 1'}, {conversation_id: 2, text: 'hello to 2'}])