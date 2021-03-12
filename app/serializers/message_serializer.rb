class MessageSerializer
  include JSONAPI::Serializer
  attributes :text, :conversation_id
  attribute :created_at do |object|
    object.created_at.strftime('%Y %m %d %H:%M:%S %Z')
  end
  attribute :author do |object|
    User.find(object.user_id).username
  end
end
