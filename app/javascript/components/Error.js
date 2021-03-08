import React from 'react'
import styled from 'styled-components';

const ErrorBox = styled.div`
  color:red;
  padding: 0.5em;
`

const Error = (props) => {
  return (
    <ErrorBox>
      {props.message}
    </ErrorBox>
  )
}

export default Error
