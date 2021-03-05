import React, { useState, useEffect, useRef } from "react";
import consumer from "../channels/consumer";
import axios from "axios";

import ConversationForm from "../components/conversationForm";

const app = () => {
  const [conversations, _setConversations] = useState([]);

  // Need to use a Ref to store current value of conversations
  // so that handleReceivedConversation() can access current value of conversations
  // even though the callback function is defined on subscription creation
  // (accessing conversations will always return the initial value [])
  const conversationsRef = useRef(conversations);
  const setConversations = (data) => {
    _setConversations(data);
    conversationsRef.current = data;
  };

  const handleReceivedConversation = (data) => {
    setConversations([...conversationsRef.current, data]);
  };

  // On app load, fetch conversations from API and create subscriptions to each conversation
  useEffect(() => {
    axios
      .get("/conversations")
      .then((resp) => {
        setConversations(resp.data);
      })
      .then(() => {
        consumer.subscriptions.create("ConversationsChannel", {
          received(resp) {
            handleReceivedConversation(resp);
          },
          connected() {
            console.log("CONNECTED TO APP SOCKET");
          },
        });
      });
    // Disconnect on unmount
    return () => {
      consumer.disconnect();
    };
  }, []);

  return (
    <div>
      <ConversationForm />
      {conversations.map((conv) => (
        <p>{conv.title}</p>
      ))}
    </div>
  );
};

export default app;
