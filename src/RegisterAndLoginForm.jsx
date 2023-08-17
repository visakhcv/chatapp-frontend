import axios from 'axios'
import React, { useContext, useState } from 'react'
import { UserContext } from './UserContext'

function RegisterAndLoginForm() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoginOrRegister, setLoginOrRegister] = useState("login")
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext)

  async function handleSubmit(e) {
    e.preventDefault()
    const url = isLoginOrRegister === 'register' ? 'register' : 'login'
    const { data } = await axios.post(url, { username, password })
    setLoggedInUsername(username)
    setId(data.id)
    
  }
  

  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder='username' className='block border w-full rounded-sm p-2 mb-2' />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='password' className='block border w-full rounded-sm p-2 mb-2' />
        <button className='bg-green-500 text-white block w-full rounded-sm p-2'>{isLoginOrRegister === 'register' ? 'Register' : 'Login'}</button>
        <div className='text-center mt-2'>
          {isLoginOrRegister === 'register' && (
            <div>
              Already a member?
              <button className='ml-1' onClick={() => setLoginOrRegister('login')}>Login</button>
            </div>
          )}
          {isLoginOrRegister === 'login' && (
            <div>
              Dont have an account?
              <button className='ml-1' onClick={() => setLoginOrRegister('register')}>Register</button>
            </div>
          )}

        </div>
      </form>
    </div>
  )
}

export default RegisterAndLoginForm