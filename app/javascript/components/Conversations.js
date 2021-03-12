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
  height: 100vh;
  flex-direction: column;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const ConversationsIndex = styled.div`
  width: 250px;
  padding: 1em;
  height: 100%;

  overflow-y: scroll;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  @media (max-width: 650px) {
    flex: 1;
    display: ${(props) => (props.visible ? "block" : "none")};
    width: 100%;
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

const MenuButton = styled.button`
  font-size: 2em;
  display: none;

  @media (max-width: 650px) {
    display: ${(props) => (props.visible ? "block" : "none")};
  }
`;

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: space-between;
  align-items:center;

  h3 {
    padding: 1em;
  }
`;

const Chatbox = styled.div`
  height: 100%;
  flex: 1;
  padding: 0 1em;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  @media (max-width: 650px) {
    display: ${(props) => (props.visible ? "inherit" : "none")};
  }
`;

const LogoutButton = styled.button`
  font-size: 2em;

  @media (max-width: 650px) {
    display: ${(props) => (props.visible ? "block" : "none")};
  }
`;

const Conversations = () => {
  const [conversations, _setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [currentUser] = useState(localStorage.getItem("currentUser"));
  const [showConversation, setShowConversation] = useState(false);
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
      let newConversations = [...conversationsRef.current];
      newConversations[index] = data;
      setConversations(newConversations);
    }
  };

  // Callback when conversations is updated
  useEffect(() => {
    if (activeConversation) {
      const conversation = conversations.find(
        (conv) => conv.id === activeConversation.id
      );
      setActiveConversation(conversation);
    }
  }, [conversations]);

  // Update conversation with received message
  const handleReceivedMessage = (message) => {
    const new_conversations = [...conversationsRef.current];
    const conversation = new_conversations.find(
      (conv) => parseInt(conv.id) === message.data.attributes.conversation_id
    );
    conversation.attributes.messages.data = [
      ...conversation.attributes.messages.data,
      message.data,
    ];

    if (!activeConversation || conversation.id !== activeConversation.id) {
      conversation.unread = true;
    }

    setConversations(new_conversations);
  };

  // On app load, fetch conversations from API and create subscription to conversation channel
  useEffect(() => {
    axios
      .get("/conversations/get_all", { withCredentials: true })
      .then((resp) => {
        setConversations(resp.data.data);

        consumer.subscriptions.create(
          { channel: "ConversationsChannel", username: currentUser },
          {
            received(resp) {
              handleReceivedConversation(resp.data);
            },
          }
        );

        const firstConversation = resp.data.data[0];
        if (firstConversation) {
          setActiveConversation(firstConversation);
        }
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

  const handleConversationClick = (conv) => {
    setActiveConversation(conv);

    // Clear unread status
    let newConv = { ...conv };
    newConv.unread = false;
    let newConversations = [...conversations];
    const index = newConversations.findIndex((c) => c.id === newConv.id);
    newConversations[index] = newConv;
    setConversations(newConversations);

    // Show selected conversation if below width breakpoint
    setShowConversation(true);
  };

  const toggleMenu = () => {
    setShowConversation(!showConversation);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    history.push("/");
  };

  const conversationButtons = conversations.map((conv) => {
    const messages = conv.attributes.messages.data;
    const lastMessage = messages[messages.length - 1];
    let timestamp, author, hours, minutes;
    if (lastMessage !== undefined) {
      timestamp = new Date(lastMessage.attributes.created_at);
      hours = timestamp.getHours();
      minutes = timestamp.getMinutes();

      // Add leading zero
      minutes = parseInt(minutes) < 10 ? '0' + minutes : minutes

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
        <ConversationButton onClick={() => handleConversationClick(conv)}>
          <h4>{conv.attributes.title}</h4>
          {lastMessage !== undefined && (
            <div style={{ display: "flex" }}>
              <p style={{ flex: 1 }}>
                {author}: {lastMessage.attributes.text.slice(0, 50)}... ·{" "}
                <Timestamp>
                  {hours}:{minutes}
                </Timestamp>
              </p>
              {conv.unread && (
                <p
                  style={{
                    marginLeft: 0.5 + "em",
                    position: "relative",
                    top: -14 + "px",
                  }}
                >
                  <i className="fas fa-circle"></i>
                </p>
              )}
            </div>
          )}
        </ConversationButton>
      </Fragment>
    );
  });

  return (
    <ConversationsWrapper>
      <Header>
        <h3>Chats</h3>
        <MenuButton visible={showConversation} onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </MenuButton>
        <LogoutButton visible={!showConversation} onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
        </LogoutButton>
      </Header>
      <div style={{ display: "flex", flex: 1, height: 80 + '%' }}>
        <ConversationsIndex visible={!showConversation}>
          <ConversationForm />
          {conversationButtons}
        </ConversationsIndex>
        {activeConversation && (
          <Chatbox visible={showConversation}>
            <Messenger
              id={activeConversation.id}
              messages={activeConversation.attributes.messages}
              title={activeConversation.attributes.title}
              usernames={activeConversation.attributes.usernames}
            />
          </Chatbox>
        )}
      </div>
    </ConversationsWrapper>
  );
};

export default Conversations;
