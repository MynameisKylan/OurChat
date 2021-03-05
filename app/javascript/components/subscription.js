import React, { useEffect } from 'react'
import consumer from "../channels/consumer";

const subscription = ({ conversation_id, handleReceivedMessage }) => {
  // Create subscription to specified conversation
  useEffect(() => {
    consumer.subscriptions.create({channel: "MessagesChannel", conversation_id: conversation_id}, {
      received(data) {
        console.log(data)
        handleReceivedMessage(data)
      },
      connected() {
        console.log(`connected to conversation id ${conversation_id}`)
      }
    })
  }, [])

  return (
    <div>
      
    </div>
  )
}

export default subscription