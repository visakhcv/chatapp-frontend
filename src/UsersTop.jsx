import axios from 'axios'
import React, { useEffect, useState } from 'react'

function UsersTop({ userId, id }) {


    return (
        <div className='h-12 flex bg-gray-400 '>
            <div className='items-center h-full pl-2 flex gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="evenodd" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>

                <h2 className='text-white' style={{fontSize:'1.5rem'}}>{userId[0]?.username} </h2>
            </div>


        </div>
    )
}

export default UsersTop