import React from 'react'

function Avatar({userId,username,online}) {
    const colors=['bg-red-200','bg-green-200','bg-blue-200','bg-purple-200',
                    'bg-yellow-200','bg-teal-200']
    const userIdBase10= parseInt(userId.substring(10), 16)
    const colorIndex=userIdBase10 % colors.length  
    const color = colors[colorIndex]  
 
  return (
    <div className={"w-8 h-8 relative flex items-center rounded-full "+ color}>
       <div className='text-center w-full opacity-70'> {username[0]}</div>
       {online && (
        <div className="absolute w-3 h-3 bg-green-500 border border-white rounded-full bottom-0 right-0"></div>
       )}
       {
        !online && (
          <div className="absolute w-3 h-3 bg-gray-500 border border-white rounded-full bottom-0 right-0"></div>
        )
       }
       
    </div>
  )
}

export default Avatar