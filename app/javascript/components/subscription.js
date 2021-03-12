import React, { useEffect } from 'react'
import consumer from "../channels/consumer";

const subscription = ({ conversation_id, handleReceivedMessage }) => {
  // Create subscription to specified conversation
  useEffect(() => {
    consumer.subscriptions.create({channel: "MessagesChannel", conversation_id: conversation_id, username: localStorage.getItem('currentUser')}, {
      received(data) {
        handleReceivedMessage(data)
      }
    })
  }, [])

  return (
    <div>
      
    </div>
  )
}

export default subscription
