class MembershipsController < ApplicationController
  def create
    user = User.find_by(username: membership_params[:username])
    error = 'Could not add user. Please try again.'
    if user.nil?
      error = 'No user with that username.'
    elsif Membership.find_by(conversation_id: membership_params[:conversation_id], user_id: user.id)
      error = "#{user.username} is already in this conversation."
    else
      membership = Membership.new(conversation_id: membership_params[:conversation_id], user_id: user.id)
      if membership.save
        conversation = Conversation.find(membership_params[:conversation_id])
        # Broadcast updated conversation to each member, including new member
        conversation.users.each do |usr|
          ConversationsChannel.broadcast_to(usr, ConversationSerializer.new(conversation).serializable_hash)
        end
        render json: { username: user.username } and return
      end
    end

    render json: { error: error }
  end

  private

  def membership_params
    params.require(:membership).permit(:conversation_id, :username)
  end
end
