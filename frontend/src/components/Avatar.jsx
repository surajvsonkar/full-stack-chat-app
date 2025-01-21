import React from 'react'

const Avatar = ({userId,username}) => {
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200', 'bg-yellow-200', 'bg-teal-200']
    const userIdBase10 = parseInt(userId, 15)
    const colorIndex = userIdBase10 % colors.length
    const color = colors[colorIndex]
    console.log(color)
  return (
    <div className={`w-8 h-8 ${color} rounded-full text-xl flex justify-center opacity-70`}>
        {username[0]}
    </div>
  )
}

export default Avatar