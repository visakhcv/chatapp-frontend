import React, { useContext, useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { UserContext } from './UserContext'
import { uniqBy } from 'lodash'
import axios from 'axios'
import './chat.css'
import Contact from '../Contact'
import UsersTop from './UsersTop'

function Chat() {
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({})
    const [offlinePeople, setOfflinePeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const { username, id, setId, setUsername } = useContext(UserContext)
    const [newMessageText, setNewMessageText] = useState('')
    const [userdetails,setUserdetails] = useState([])
    const [messages, setMessages] = useState([])
    const divUnderMessages = useRef()
    useEffect(() => {
        connectToWs()
    }, [])

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:4000')
        setWs(ws)
        ws.addEventListener('message', handleMessage)
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('trying to connect');
                connectToWs()
            }, 1000)
        })
    }

    function showOnlinePeople(peopleArray) {
        const people = {}
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username
        })
        setOnlinePeople(people);

    }

    

    function handleMessage(e) {
        const messageData = JSON.parse(e.data)
        console.log({ e, messageData });
        if ('online' in messageData) {
            showOnlinePeople(messageData.online)
        } else if ('text' in messageData) {
            if (messageData.sender === selectedUserId) {
                setMessages(prev => ([...prev, { ...messageData }]))
            }

        }
    }

    async function logout() {
        await axios.post('/logout').then(() => {
            setWs(null)
            setId(null)
            setUsername(null)
        })
    }

    async function sendMessage(e, file = null) {
        if (e) e.preventDefault()

        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            file,
        }))

        if (file) {
             await axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data)
            })
        } else {
            setNewMessageText('');
            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now()
            }]))
        }


    }


    function sendfile(e) {
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            sendMessage(null, {
                name: e.target.files[0].name,
                data: reader.result
            })
            console.log({ data });
        }

    }

    useEffect(() => {
        const div = divUnderMessages.current
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }

    }, [messages])

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data.filter(p => p._id !== id).filter(p => !Object.keys(onlinePeople).includes(p._id))
            const offlinePeople = {}
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p
            })
            setOfflinePeople(offlinePeople);
        })
    }, [onlinePeople])

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data)
            })
        }
        
    }, [selectedUserId])

    console.log(selectedUserId);

    const onlinePeopleExcOUrUser = { ...onlinePeople }
    delete onlinePeopleExcOUrUser[id]

    const messagesWithoutDupes = uniqBy(messages, '_id')

    return (
        <div className='chat-main'>
            <div className='chat-box'>
                <div className="bg-white w-1/3 flex flex-col">
                    <div className='flex-grow'>
                        <Logo />

                        {Object.keys(onlinePeopleExcOUrUser).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                username={onlinePeopleExcOUrUser[userId]}
                                onClick={() => setSelectedUserId(userId)}
                                online={true}
                                selected={userId === selectedUserId} />
                        ))}
                        {Object.keys(offlinePeople).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                username={offlinePeople[userId].username}
                                onClick={() => setSelectedUserId(userId)}
                                online={false}
                                selected={userId === selectedUserId} />
                        ))}
                    </div>

                    <div className='p-2 text-center flex items-center justify-center'>
                        <span className='mr-2 text-sm text-gray-600 flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="evenodd" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>

                            {username} </span>
                        <button onClick={logout} className='text-sm bg-green-200 py-1 border rounded-sm px-2 text-gray-500'>logout</button>
                    </div>
                </div>
                <div className="flex wallpaper flex-col bg-green-100 w-2/3  ">
                
                     <UsersTop userId={userdetails} id={id} />

                    <div className='flex-grow p-2'>
                        {!selectedUserId && (
                            <div className='flex h-full items-center justify-center'>
                                <div className='text-gray-400'> &larr; Select a person from sidebar</div>
                            </div>
                        )}
                        {!!selectedUserId && (
                            <div className='relative  h-full'>
                                <div className="overflow-y-scroll  chat-scroll absolute  top-0 left-0 right-0 bottom-2">
                                    {messagesWithoutDupes.map(message => (
                                        <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')} >
                                            <div className={"inline-block box p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-green-500 text-white ' : 'bg-white text-gray-500')}>

                                                {message.text}
                                                {message.file && (
                                                    <div>

                                                        <a target='_blank' className='border-b flex items-center gap-1' href={axios.defaults.baseURL + '/uploads/' + message.file} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                                            </svg>
                                                            {message.file}
                                                        </a>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                    ))}
                                    <div ref={divUnderMessages}></div>
                                </div>
                            </div>

                        )}
                    </div>
                    {!!selectedUserId && (
                        <form onSubmit={sendMessage} className='flex gap-2'>
                            <input value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} type="text" placeholder='Type ypur message here' className='bg-white border p-2 flex-grow' />
                            <label className='bg-green-200 p-2 cursor-pointer text-gray-600 border border-green-200 rounded-sm' type='button'>
                                <input type="file" className='hidden' onChange={sendfile} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                </svg>

                            </label>
                            <button type='submit' className='bg-green-500 p-2 text-white rounded-sm'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>

                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>

    )
}

export default Chat