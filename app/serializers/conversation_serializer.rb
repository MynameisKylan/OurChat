class ConversationSerializer
  include JSONAPI::Serializer
  attributes :title
  attribute :usernames do |object|
    object.users.map{ |usr| usr.username }
  end
  has_many :messages
end
