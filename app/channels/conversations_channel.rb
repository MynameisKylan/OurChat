class ConversationsChannel < ApplicationCable::Channel
  def subscribed
    # This channel name used in conversations_controller.rb
    # to broadcast to right channel
    stream_from "conversations_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
