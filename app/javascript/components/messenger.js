import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Chatbox = styled.div`
  height: 100vh;
  flex: 1;
  padding: 0 1em;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const MessageBox = styled.div`
  height: 80%;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 1em;
`;

const Message = styled.p`
  margin: ${(props) =>
    props.self ? "0.1em 0 0.1em auto" : "0.1em auto 0.1em 0"};
  width: fit-content;
  max-width: 80%;
  border-radius: 9px;
  background: ${(props) =>
    props.self ? "rgb(0, 80, 172)" : "rgba(255,255,255,0.1)"};
  padding: 0.4em;
`;

const ChatForm = styled.form`
  display: flex;

  input {
    flex: 1;
  }
`;

const messenger = ({ id, title, messages, usernames }) => {
  const [message, setMessage] = useState("");
  const [currentUser] = useState(localStorage.getItem("currentUser"));
  const [userToAdd, setUserToAdd] = useState("");
  const [members, setMembers] = useState(usernames)

  useEffect(() => {
    setMembers(usernames)
  }, [usernames])

  const sendMessage = (e) => {
    e.preventDefault();

    axios
      .post("/messages", {
        message: { text: message, conversation_id: id },
      })
      .then(() => {
        setMessage("");
      });
  };

  const addUserToConversation = (e) => {
    e.preventDefault();
    setUserToAdd("");

    axios
      .post("/memberships", {
        withCredentials: true,
        membership: { conversation_id: id, username: userToAdd },
      })
      .then((resp) => {
        console.log(resp);
      });
  };

  return (
    <Chatbox>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h2>{title}</h2>
        <p>Members: {members.join(', ')}</p>
      </div>
      <form>
        <input
          onChange={(e) => setUserToAdd(e.target.value)}
          placeholder="username"
          value={userToAdd}
        ></input>
        <button onClick={addUserToConversation}>Add To Conversation</button>
      </form>
      <MessageBox>
        <div>
          {messages.data.map((msg) => (
            <Message
              key={msg.id}
              self={msg.attributes.author === currentUser ? "true" : null}
            >
              {msg.attributes.author === currentUser
                ? ""
                : msg.attributes.author + ": "}
              {msg.attributes.text}
            </Message>
          ))}
        </div>
      </MessageBox>
      <ChatForm>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </ChatForm>
    </Chatbox>
  );
};

export default messenger;
