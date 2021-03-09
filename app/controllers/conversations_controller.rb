class ConversationsController < ApplicationController
  def get_all
    conversations = current_user.conversations
    render json: ConversationSerializer.new(conversations).serializable_hash
  end

  def create
    conversation = Conversation.new(conversation_params)
    if conversation.save
      # Create memberships for each member
      conversations_params[:usernames].each do |username|
        user = User.find_by(username: username)
        Membership.create(user_id: user.id, conversation_id: conversation.id)
      end

      # Broadcast new conversation to channel name defined in conversations_channel.rb
      ActionCable.server.broadcast('conversations_channel', conversation)
      head :ok
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title, :usernames)
  end
end
