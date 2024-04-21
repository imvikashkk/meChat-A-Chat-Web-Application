import React from 'react'
import Image from 'next/image'

interface userCardType {
    name:string,
    avatar:string,
    latestMessage:any,
    type:string
    time?:string
}

const UsersCard = ({name, avatar,time, latestMessage, type}:userCardType) => {
  return (
    <div className="select-none flex items-center py-2 overflow-auto px-2 xs:px-1 border-b border-gray-200 relative dark:border-gray-600 hover:bg-slate-100 hover:cursor-pointer dark:hover:bg-slate-800">

      {/* Avatar on the left */}
      <div className="flex-shrink-0 mr-4 xl:mr-1 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image className="w-full h-full object-cover" width={100} height={100} src={avatar} alt="Avatar" />
        </div>
        
      </div>
        
        {
        type == "chat" &&
        /* Name, latest message, and time on the right */
          <div className="flex-1">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{name}</h2>
             </div>
            <p className="text-gray-500 truncate xl:-mt-2">{latestMessage}</p>
         </div>
        }

        {
           type == "user" &&
              /* Name */
          <div className="flex-1">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{name}</h2>
             </div>
           </div>
        }
      

    </div>
  )
}

export default UsersCard
