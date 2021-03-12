import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>OurChat</h1>
      <p>A chat app as seamless as your conversation.</p>
      
      <Link to='/login'>Login</Link>
      <Link to='signup'>Sign Up</Link>
    </div>
  )
}

export default Home
