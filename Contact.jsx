import React from 'react'
import Avatar from './src/Avatar'

function Contact({id,onClick,selected,username,online }) {
    return (
        <div key={id} onClick={() => onClick(id)} className={'border-b border-gray-100 flex items-center gap-2 cursor-pointer ' + ( selected ? 'bg-green-200' : '')}>
            {selected ? (
                <div className='w-1 bg-green-500 h-12 rounded-r-md'></div>
            ):''}
            <div className='flex gap-2 items-center pl-4 p-2 '>
                <Avatar online={online} username={username} userId={id} />
                <span className='text-gray-800'> {username}</span>
            </div>

        </div>
    )
}

export default Contact