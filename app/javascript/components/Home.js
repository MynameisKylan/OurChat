import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Button = styled(Link)`
  margin: 1em auto;
  display:block;
  color:white;
  text-decoration:none;
  padding: 1em;
  border-radius: 5px;
  background: rgba(255,255,255,0.1);
  max-width: 250px;

  &:hover {
    background: rgba(255,255,255,0.2);
    transition: 0.2s ease;
  }
`

const Home = () => {
  return (
    <div className='wrapper'>
      <h1>OurChat</h1>
      <p>A chat app as seamless as your conversation.</p>

      <Button to="/login">Login</Button>
      <Button to="signup">Sign Up</Button>
    </div>
  );
};

export default Home;
