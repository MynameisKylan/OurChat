class MessageSerializer
  include JSONAPI::Serializer
  attributes :text, :created_at, :conversation_id
  attribute :author do |object|
    User.find(object.user_id).username
  end
end
