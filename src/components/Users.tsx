"use client";
import { useEffect, useState } from "react";
import { firestore, app } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import UsersCard from "./UsersCard";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

function Users({
  userData,
  setSelectedChatroom,
}: {
  userData: any;
  setSelectedChatroom: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [activeTab, setActiveTab] = useState("chatrooms");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userChatrooms, setUserChatrooms] = useState<any[]>([]);
  const router = useRouter();
  const auth = getAuth(app);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };


  //get all users
  useEffect(() => {
    setLoading2(true);
    const tasksQuery = query(collection(firestore, "users"));
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
      setLoading2(false);
    });
    return () => unsubscribe();
  }, []);

  //get chatrooms
  useEffect(() => {
    setLoading(true);
    if (!userData?.id) return;
    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );
    const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setUserChatrooms(chatrooms);
    });
    // Cleanup function for chatrooms
    return () => unsubscribeChatrooms();
  }, [userData]);

  // Create a chatroom
  const createChat = async (user: any) => {
    // Check if a chatroom already exists for these users
    const existingChatroomsQuery1 = query(
      collection(firestore, "chatrooms"),
      where("users", "==", [userData.id, user.id])
    );
    const existingChatroomsQuery2 = query(
      collection(firestore, "chatrooms"),
      where("users", "==", [user.id, userData.id])
    );
    try {
      const existingChatroomsSnapshot1 = await getDocs(existingChatroomsQuery1);
      const existingChatroomsSnapsho2 = await getDocs(existingChatroomsQuery2);
      if (existingChatroomsSnapshot1.docs.length > 0 || existingChatroomsSnapsho2.docs.length > 0) {
        // Chatroom already exists, handle it accordingly (e.g., show a message)
        console.log("Chatroom already exists for these users.");
        toast.error("Chatroom already exists for these users.");
        return;
      }
      // Chatroom doesn't exist, proceed to create a new one
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };
      const chatroomData = {
        users: [userData.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };
      const chatroomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatroomData
      );
      console.log("Chatroom created with ID:", chatroomRef.id);
      setActiveTab("chatrooms");
      toast.success("ChatRoom created successfully !")
    } catch (error) {
      console.error("Error creating or checking chatroom:", error);
    }
  };

  //open chatroom
  const openChat = async (chatroom: any) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData:
        chatroom.usersData[
          chatroom.users.find((id: string) => id !== userData.id)
        ],
    };
    setSelectedChatroom(data);
  };

  const logoutClick = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        router.replace("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="shadow-lg dark:shadow-slate-600 h-screen pt-4 overflow-auto">
        <div className="flex justify-start px-4 items-center select-none">
          <Image
            src={userData?.avatar}
            alt="avatar"
            width={100}
            height={100}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-2 text-lg font-semibold leading-4">{userData?.name} {` (you)`}</div>
        </div>
      <div className="w-full flex xl:flex-col md:flex-row justify-between items-center xl:items-stretch xl:gap-2 p-4">
        <button
          className={`btn btn-outline ${
            activeTab === "users" ? "btn-primary" : ""
          } w-[31%] xl:w-full md:w-[31%] px-2`}
          onClick={() => handleTabClick("users")}>
          Users
        </button>
        <button
          className={`btn btn-outline ${
            activeTab === "chatrooms" ? "btn-primary" : ""
          } w-[31%] xl:w-full md:w-[31%] px-2`}
          onClick={() => handleTabClick("chatrooms")}>
          Chatrooms
        </button>
        <button className={`btn btn-outline xl:w-full w-[31%] md:w-[31%] px-2`} onClick={logoutClick}>
          Logout
        </button>
      </div>

      <div>
        {activeTab === "chatrooms" && (
          <>
            <h1 className="px-4 text-base font-semibold">Chatrooms</h1>
            {loading && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {userChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                onClick={() => {
                  openChat(chatroom);
                }}>
                <UsersCard
                  name={
                    chatroom.usersData[
                      chatroom.users.find((id: string) => id !== userData?.id)
                    ].name
                  }
                  avatar={
                    chatroom.usersData[
                      chatroom.users.find((id: string) => id !== userData?.id)
                    ].avatar
                  }
                  latestMessage={chatroom.lastMessage}
                  type={"chat"}
                />
              </div>
            ))}
          </>
        )}

        {activeTab === "users" && (
          <>
            <h1 className="px-4 text-base font-semibold">Users</h1>
            {loading2 && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  createChat(user);
                }}>
                {user.id !== userData?.id && (
                  <UsersCard
                    name={user.name}
                    avatar={user.avatar}
                    latestMessage={""}
                    type={"user"}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
      
    </div>
  );
}

export default Users;
