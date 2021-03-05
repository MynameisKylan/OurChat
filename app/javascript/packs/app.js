import React, { useState, useEffect } from "react";
import consumer from "../channels/consumer";
import axios from "axios";

const app = () => {
  const [conversations, setConversations] = useState([]);

  // On app load, fetch conversations from API and create subscriptions to each conversation
  useEffect(() => {
    axios
      .get("/conversations")
      .then((resp) => {
        setConversations(resp.data);
      })
      .then(() => {
        conversations.forEach((conv) => {
          consumer.subscriptions.create({
            channel: "ConversationsChannel",
            conversation_id: conv.id,
          });
        });
      });
    // Disconnect on unmount
    return () => {
      consumer.disconnect();
    };
  }, []);

  return <div>hello</div>;
};

export default app;
