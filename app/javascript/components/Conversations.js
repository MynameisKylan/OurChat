import React, { Fragment, useState, useEffect, useRef } from "react";
import consumer from "../channels/consumer";
import axios from "axios";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import ConversationForm from "../components/conversationForm";
import Subscription from "../components/subscription";
import Messenger from "../components/messenger";

const ConversationsWrapper = styled.div`
  display: flex;
`;

const ConversationsIndex = styled.div`
  width: 250px;
  padding-right: 1em;
  height: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
    width: 15px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px grey;
    border-radius: 10px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b30000;
  }
`;

const ConversationButton = styled.button`
  width: 100%;
`;

const Timestamp = styled.span`
  font-size: 0.85em;
  opacity: 0.8;
`;

const Conversations = () => {
  const [conversations, _setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const history = useHistory();

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
      (conv) => parseInt(conv.id) === message.data.attributes.conversation_id
    );
    conversation.attributes.messages.data = [
      ...conversation.attributes.messages.data,
      message.data,
    ];
    setConversations(new_conversations);
  };

  // On app load, fetch conversations from API and create subscription to conversation channel
  useEffect(() => {
    axios
      .get("/conversations/get_all", { withCredentials: true })
      .then((resp) => {
        console.log(resp);
        setConversations(resp.data.data);
      })
      .then(() => {
        consumer.subscriptions.create("ConversationsChannel", {
          received(resp) {
            handleReceivedConversation(resp);
          },
        });
      })
      .catch(() => {
        // If not authenticated, remove currentUser, redirect to login page
        localStorage.removeItem("currentUser");
        history.push("/login");
      });
    // Disconnect on unmount
    return () => {
      consumer.disconnect();
    };
  }, []);

  const conversationButtons = conversations.map((conv) => {
    const messages = conv.attributes.messages.data;
    const lastMessage = messages[messages.length - 1];
    const timestamp = new Date(lastMessage.attributes.created_at);

    return (
      <Fragment key={conv.id}>
        <Subscription
          conversation_id={conv.id}
          handleReceivedMessage={handleReceivedMessage}
        />
        <ConversationButton onClick={() => setActiveConversation(conv)}>
          <h3>{conv.attributes.title}</h3>
          <p>
            {lastMessage.attributes.author}: {lastMessage.attributes.text} ·{" "}
            <Timestamp>
              {timestamp.getHours()}:{timestamp.getMinutes()}
            </Timestamp>
          </p>
        </ConversationButton>
      </Fragment>
    );
  });

  return (
    <ConversationsWrapper>
      <ConversationsIndex>
        <ConversationForm />
        {conversationButtons}
      </ConversationsIndex>
      {activeConversation && <Messenger conversation={activeConversation} />}
    </ConversationsWrapper>
  );
};

export default Conversations;
