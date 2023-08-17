import React, { useContext } from 'react'
import RegisterAndLoginForm from './RegisterAndLoginForm'
import { UserContext } from './UserContext';
import Chat from './Chat';


function Routes() {
    const {username,id} = useContext(UserContext)
    console.log(username);
    if(username){
        return <Chat/>
    }
  return (
   <RegisterAndLoginForm/>
  )
}

export default Routes