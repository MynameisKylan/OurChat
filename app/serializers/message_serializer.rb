class MessageSerializer
  include JSONAPI::Serializer
  attributes :text, :created_at
end
