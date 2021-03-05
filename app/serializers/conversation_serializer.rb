class ConversationSerializer
  include JSONAPI::Serializer
  attributes :title
  has_many :messages
end
