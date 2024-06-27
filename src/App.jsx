
import axios from 'axios'
import {  UserContextProvider } from "./UserContext"

import Routes from "./Routes"


function App() {
  axios.defaults.baseURL='https://main.d1erddn7nvcs64.amplifyapp.com'
  axios.defaults.withCredentials= true
  

  return (
      <UserContextProvider>
        <Routes/>
      </UserContextProvider>
        
      
  
  )
}

export default App
