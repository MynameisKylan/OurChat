import React, { Fragment, useState, useEffect, useRef } from "react";
import consumer from "../channels/consumer";
import axios from "axios";

import ConversationForm from "../components/conversationForm";
import Subscription from "../components/subscription";
import Messenger from "../components/messenger";

const Conversations = () => {
  const [conversations, _setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

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

  const handleReceivedMessage = (message) => {
    const new_conversations = [...conversations];
    const conversation = new_conversations.find(
      (conv) => conv.id === message.conversation_id
    );
    conversation.messages = [...conversation.messages, message];
    setConversations(new_conversations);
  };

  // On app load, fetch conversations from API and create subscription to conversation channel
  useEffect(() => {
    axios
      .get("/conversations", {withCredentials: true})
      .then((resp) => {
        setConversations(resp.data);
      })
      .then(() => {
        consumer.subscriptions.create("ConversationsChannel", {
          received(resp) {
            handleReceivedConversation(resp);
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
      {conversations.map((conv) => (
        <Fragment key={conv.id}>
          <Subscription
            conversation_id={conv.id}
            handleReceivedMessage={handleReceivedMessage}
          />
          <button onClick={() => setActiveConversation(conv)}>
            {conv.title}
          </button>
        </Fragment>
      ))}
      <ConversationForm />
      {activeConversation && <Messenger conversation={activeConversation} />}
    </div>
  );
};

export default Conversations;
