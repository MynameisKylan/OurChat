class MessagesController < ApplicationController
  def create
    text = message_params[:text]
    conversation_id = message_params[:conversation_id].to_i
    user_id = current_user.id

    message = Message.create(text: text, conversation_id: conversation_id, user_id: user_id)
    if message.save!
      conversation = Conversation.find(message_params[:conversation_id].to_i)
      MessagesChannel.broadcast_to(conversation, MessageSerializer.new(message).serializable_hash)
      head :ok
    end
  end

  private

  def message_params
    params.require(:message).permit(:text, :conversation_id)
  end
end
