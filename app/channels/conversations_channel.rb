class ConversationsChannel < ApplicationCable::Channel
  def subscribed
    user = User.find_by(username: params[:username])
    # https://stackoverflow.com/questions/43941025/send-actioncable-to-particular-user
    stream_for user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
