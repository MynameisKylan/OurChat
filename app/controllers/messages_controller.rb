class MessagesController < ApplicationController
  def create
    message = Message.create(message_params)
    if message.save
      conversation = Conversation.find(message_params[:conversation_id])
      MessagesChannel.broadcast_to(conversation, message)
      head :ok
    end
  end

  private

  def message_params
    params.require(:message).permit(:text, :conversation_id)
  end
end
