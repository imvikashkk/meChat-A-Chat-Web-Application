"use client";
import React, { useEffect, useState } from "react";
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Users from "@/components/Users";
import ChatRoom from "@/components/ChatRoom";

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setUser(data);
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (!user) return <div className="text-4xl">Loading...</div>;

  return (
    <div className="h-screen overflow-hidden">
      {/* Mobile View */}
      <div className="hidden md:block ">
        {selectedChatroom ? (
          <div className="flex-grow w-full">
            <ChatRoom
              user={user}
              setSelectedChatroom={setSelectedChatroom}
              selectedChatroom={selectedChatroom}
            />
          </div>
        ) : (
          <Users userData={user} setSelectedChatroom={setSelectedChatroom} />
        )}
      </div>
      {/* DeskTop View */}
      <div className="flex w-full h-full md:hidden">
        {/* Left side users */}
        <div className="flex-shrink-0 w-3/12">
          <Users userData={user} setSelectedChatroom={setSelectedChatroom} />
        </div>
        {/* Right side chat room */}
        <div className="flex-grow w-9/12">
          {selectedChatroom ? (
            <>
              <ChatRoom user={user} selectedChatroom={selectedChatroom} />
            </>
          ) : (
            <>
              <div className="flex items-center justify-center h-full">
                <div className="text-2xl text-gray-400">Select a chatroom</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
