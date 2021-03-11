class ConversationsController < ApplicationController
  def get_all
    conversations = current_user.conversations
    render json: ConversationSerializer.new(conversations).serializable_hash
  end

  def create
    conversation = Conversation.new(conversation_params)
    if conversation.save
      # Create membership for creating member
      Membership.create(conversation_id: conversation.id, user_id: current_user.id)

      # Broadcast new conversation to channel name defined in conversations_channel.rb
      ConversationsChannel.broadcast_to(current_user, ConversationSerializer.new(conversation).serializable_hash)
      head :ok
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title)
  end
end
