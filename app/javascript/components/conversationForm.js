import React, { useState } from "react";
import axios from "axios";

const conversationForm = () => {
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setTitle('');

    axios
      .post("/conversations", { conversation: { title: title } });
  };
  return (
    <form>
      <input
        value={title}
        onChange={handleChange}
        placeholder="Conversation title"
      />
      <button onClick={handleClick} >Create new conversation</button>
    </form>
  );
};

export default conversationForm;
