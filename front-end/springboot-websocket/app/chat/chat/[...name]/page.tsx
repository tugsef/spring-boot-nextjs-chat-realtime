"use client";
import React, { useEffect,  useState } from "react";
import ChatListComponent from "@/components/ChatPage/ChatListComponent";
import { Message } from "@/entities/EntityList";
import { Client } from "@stomp/stompjs";
import { User, fetchUserById } from "@/data/User";
import SockJS from "sockjs-client";
import ChatClose from "@/components/ChatClose";
import { WS_URL } from "@/lib/config";

export default function page({
  params: { name },
}: {
  params: { name: string[] };
}) {
  const [messages, setMessages] = useState<Message>({} as Message);
  const [input, setInput] = useState<any>("");
  const [client, setClient] = useState<any>(null);
  const [fromUser, setFromUser] = useState<User | null>(null);
  const [toUser, setToUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch both users
    Promise.all([
      fetchUserById(Number(name[0])),
      fetchUserById(Number(name[1]))
    ]).then(([from, to]) => {
      setFromUser(from);
      setToUser(to);
    });
  }, [name]);

   useEffect(() => {
     const socket = new SockJS(WS_URL);
     const stompClient = new Client({
       webSocketFactory: () => socket,
       debug: (str) => console.log(str),
       onConnect: () => {
         console.log("Connected");
         stompClient.subscribe(`/user/${name[0]}/queue/messages`, (message) => {
           const newMessage = JSON.parse(message.body);
           setMessages({
             id: newMessage.id,
             content: newMessage.content,
             recipientId: newMessage.recipientId,
             senderId: newMessage.senderId,
           });
         });
       },
       onDisconnect: () => {
         console.log("Disconnected");
       },
     });
     stompClient.activate();
     setClient(stompClient);
     console.log(messages);

     return () => {
       stompClient.deactivate();
     };
   }, [name]);


 const sendMessage = () => {
     if (client && input) {
       client.publish({
         destination: "/app/chat",
         body: JSON.stringify({
           senderId: Number(name[0]),
           recipientId: Number(name[1]),
           content: input,
           timestamp: Date.now(),
         }),
       });
       setMessages({
         id: 0,
         content: input,
         recipientId: Number(name[1]),
         senderId: Number(name[0]),
       });
       setInput("");
     }
   };
  return (
    <>
      {" "}
      <div className="container mx-auto relative mt-4 ">
        <ChatClose client={client} id={Number(name[0])} />

        <h1 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white w-full text-center">
          <mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">
            Chat
          </mark>
        </h1>
        <div className="flex justify-between">  
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            {`from: #${fromUser ? fromUser.nickName : "loading..."}`}
          </span>

          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
            {`to: #${toUser ? toUser.nickName : "loading..."}`}
          </span>
        </div>

        <div>
          <ChatListComponent
            lastMessage={messages}
            recipientId={Number(name[1])}
            senderId={Number(name[0])}
          />
          <div className="flex absolute bottom-0 right-0 w-full p-2 bg-slate-700 gap-2">
            <input
              className="text-black w-full rounded-lg p-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="content"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
