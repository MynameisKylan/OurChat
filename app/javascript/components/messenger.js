import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Chatbox = styled.div`
  height: 100vh;
  flex:1;
  padding: 1em;
`;

const MessageBox = styled.div`
  height: 80%;
  display:flex;
  flex-direction:column-reverse;
  overflow:auto;
  border: 1px solid lightgrey;
  padding: 0 1em;
`;

const messenger = ({ conversation }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();

    axios
      .post("/messages", {
        message: { text: message, conversation_id: conversation.id },
      })
      .then(() => {
        setMessage("");
      });
  };

  return (
    <Chatbox>
      <h2>{conversation.attributes.title}</h2>
      <MessageBox>
        <div>
        {conversation.attributes.messages.data.map((msg) => (
          <p key={msg.id}>
            {msg.attributes.author}: {msg.attributes.text}
          </p>
        ))}</div>
      </MessageBox>
      <form>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </Chatbox>
  );
};

export default messenger;
