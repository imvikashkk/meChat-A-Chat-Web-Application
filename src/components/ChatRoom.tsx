import React, { useState, useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import Image from "next/image";

function ChatRoom({ user, setSelectedChatroom, selectedChatroom }: any) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [message, setMessage] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<any>(null);

  // scroll
  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //get messages
  useEffect(() => {
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        console.log({ snapshot });
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      }
    );

    return unsubscribe;
  }, [chatRoomId]);

  //send message
  const sendMessage = async () => {
    const messagesCollection = collection(firestore, "messages");
    if (message == "" && image == "") {
      return;
    }
    try {
      const newMessage = {
        chatRoomId: chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image: image,
      };
      await addDoc(messagesCollection, newMessage);
      setMessage("");
      setImage("");
      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastMessage: message ? message : "Image",
      });
    } catch (error) {
      console.error("Error sending message");
    }

    // Scroll to the bottom after sending a message
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center bg-slate-400 dark:bg-slate-700 pl-1 py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-auto mr-2 text-slate-700 font-bold p-1 bg-[#ccc] rounded-full hidden md:inline-block cursor-pointer"
          onClick={() => setSelectedChatroom(null)}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        <Image
          src={other?.avatar}
          alt="avatar"
          width={100}
          height={100}
          className="w-12 h-12 rounded-full "
        />
        <div className="ml-2 text-lg xs:text-base font-semibold text-white leading-4">
          {other?.name}
        </div>
      </div>

      {/* Messages container with overflow and scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-10 pb-14 sm:px-4 md:pb-16 sm:pb-14 sm:pt-4">
        {messages?.map((message: any) => {
          return (
            <MessageCard
              key={message.id}
              message={message}
              me={me}
              other={other}
            />
          );
        })}
      </div>

      {/* Input box at the bottom */}
      <div className="sticky bottom-0">
        <MessageInput
          sendMessage={sendMessage}
          message={message}
          setMessage={setMessage}
          image={image}
          setImage={setImage}
        />
      </div>
    </div>
  );
}

export default ChatRoom;
