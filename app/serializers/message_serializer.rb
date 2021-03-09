class MessageSerializer
  include JSONAPI::Serializer
  attributes :text, :created_at
  attribute :author do |object|
    User.find(object.user_id).username
  end
end
