class ConversationsController < ApplicationController
  def index
    conversations = Conversation.all
    render json: ConversationSerializer.new(conversations).serializable_hash.to_json
  end

  def create
  
  end

  private

  def conversation_params
    params.require(:conversation).permit(:conversation_id, :title)
  end
end
