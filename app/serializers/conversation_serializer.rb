class ConversationSerializer
  include JSONAPI::Serializer
  attributes :title
  attribute :usernames do |object|
    object.users.map{ |usr| usr.username }
  end
  # Nest messages for each conversation
  # Avoids only getting reference nested, then having to get message data from separate 'included' key
  attribute :messages do |object|
    MessageSerializer.new(object.messages).serializable_hash
  end
end
