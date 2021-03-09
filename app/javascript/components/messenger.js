import React, { useState } from "react";
import axios from "axios";

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
    <div>
      <h2>{conversation.attributes.title}</h2>
      {conversation.attributes.messages.data.map((msg) => (
        <p key={msg.id}>
          {msg.attributes.author}: {msg.attributes.text}
        </p>
      ))}
      <form>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
};

export default messenger;
