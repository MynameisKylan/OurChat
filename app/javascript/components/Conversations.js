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
  padding: 1em;
  height: 100vh;

  overflow-y: scroll;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

const ConversationButton = styled.button`
  width: 100%;
  height: 76px;
  text-align: left;
  margin: 0.2em 0;
`;

const Timestamp = styled.span`
  font-size: 0.85em;
  opacity: 0.8;
`;

const Conversations = () => {
  const [conversations, _setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [currentUser] = useState(localStorage.getItem("currentUser"));
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
    // Find index if conversation already in list
    const index = conversationsRef.current.findIndex(
      (conv) => conv.id === data.id
    );
    if (index === -1) {
      // Not found
      setConversations([...conversationsRef.current, data]);
    } else {
      // Update existing conversation
      console.log('updating existing conversation')
      let newConversations = [...conversationsRef.current];
      newConversations[index] = data;
      setConversations(newConversations);
    }
  };

  // Callback when conversations is updated
  useEffect(() => {
    console.log('callback after conversations updated')
    if (activeConversation) {
      console.log('setting active conversation')
      const conversation = conversations.find((conv) => conv.id === activeConversation.id)
      setActiveConversation(conversation)
    }
  }, [conversations])

  const handleReceivedMessage = (message) => {
    const new_conversations = [...conversationsRef.current];
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
        consumer.subscriptions.create(
          { channel: "ConversationsChannel", username: currentUser },
          {
            received(resp) {
              handleReceivedConversation(resp.data);
            },
          }
        );
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
    let timestamp;
    let author;
    if (lastMessage !== undefined) {
      timestamp = new Date(lastMessage.attributes.created_at);
      author =
        lastMessage.attributes.author === currentUser
          ? "You"
          : lastMessage.attributes.author;
    }

    return (
      <Fragment key={conv.id}>
        <Subscription
          conversation_id={conv.id}
          handleReceivedMessage={handleReceivedMessage}
        />
        <ConversationButton onClick={() => setActiveConversation(conv)}>
          <h4>{conv.attributes.title}</h4>
          {lastMessage !== undefined && (
            <p>
              {author}: {lastMessage.attributes.text.slice(0, 50)}... ·{" "}
              <Timestamp>
                {timestamp.getHours()}:{timestamp.getMinutes()}
              </Timestamp>
            </p>
          )}
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
      {activeConversation && (
        <Messenger
          id={activeConversation.id}
          messages={activeConversation.attributes.messages}
          title={activeConversation.attributes.title}
          usernames={activeConversation.attributes.usernames}
        />
      )}
    </ConversationsWrapper>
  );
};

export default Conversations;
