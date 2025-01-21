import React from 'react'

const Avatar = ({userId}) => {
  return (
    <div className='w-8 h-8 bg-red-300 rounded-full text-xl flex justify-center'>
        {userId[0]}
    </div>
  )
}

export default Avatar