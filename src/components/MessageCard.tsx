import React from 'react';
import moment from 'moment';
import Image from 'next/image';

function MessageCard({ message, me, other }:any) {
  const isMessageFromMe = message.sender === me.id;

  const formatTimeAgo = (timestamp:any) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  return (
    <div key={message.id} className={`flex mb-4 ${isMessageFromMe ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar on the left or right based on the sender */}
      <div className={`w-8 h-8 ${isMessageFromMe ? 'ml-2 mr-2 sm:ml-0' : 'mr-2'}`}>
        {isMessageFromMe && (
          <Image
            className='w-full min-w-8 h-auto object-cover rounded-full'
            src={me.avatar}
            alt='Avatar'
            width={100}
            height={100}
          />
        )}
        {!isMessageFromMe && (
          <Image
            className='w-full min-w-8 h-auto object-cover rounded-full'
            src={other.avatar}
            alt='Avatar'
            height={100}
            width={100}
          />
        )}
      </div>

      {/* Message bubble on the right or left based on the sender */}
      <div className={` text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500 self-end dark:bg-[#0a0a52]' : 'bg-[#19D39E] dark:bg-[#0d4b39] self-start'}`}>
        {
          message.image && <Image src={message.image} alt='image' width={100} height={100} className='max-h-60 w-60 mb-4' />
        }
        <p className='xxs:text-sm overflow-hidden break-all'>{message.content}</p>
        <div className='text-xs text-gray-200'>{formatTimeAgo(message.time)}</div>
      </div>
    </div>
  );
}

export default MessageCard;