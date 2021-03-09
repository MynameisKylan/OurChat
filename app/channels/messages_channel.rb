class MessagesChannel < ApplicationCable::Channel
  def subscribed
    @conversation = Conversation.find(params[:conversation_id].to_i)
    @user = User.find_by(username: params[:username])

    # Reject non-members from subscribing to conversation
    reject unless can_access?(@user, @conversation)

    stream_for @conversation
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def can_access?(user, conversation)
    return true if Membership.find_by(user_id: user.id, conversation_id: conversation.id)

    false
  end
end
