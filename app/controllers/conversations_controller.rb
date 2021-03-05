class ConversationsController < ApplicationController
  # skip csrf token authentication
  skip_before_action :verify_authenticity_token
  def index
    conversations = Conversation.all
    render json: conversations, include: [:messages] #ConversationSerializer.new(conversations).serializable_hash.to_json
  end

  def create
    conversation = Conversation.new(conversation_params)
    if conversation.save

      # Broadcast new conversation to channel name defined in conversations_channel.rb
      ActionCable.server.broadcast('conversations_channel', conversation)
      head :ok
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title)
  end
end
