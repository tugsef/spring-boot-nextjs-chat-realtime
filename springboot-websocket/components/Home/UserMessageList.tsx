"use client";
import { Message } from "@/entities/EntityList";
import React, { useEffect, useState } from "react";
import UserMessageItem from "./UserMessageItem";
import Link from "next/link";
import { userList } from "@/data/User";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatClose from "../ChatClose";

function UserMessageList({ id }: { id: string }) {
  const [group, setGroup] = useState<Message[]>([]);
  const user = userList.filter((item) => item.nickName === id);

  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/group/${user[0].id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setGroup(data);
      });
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected");
        stompClient.publish({
          destination: "/app/user.addUser",
          headers: {},
          body: JSON.stringify({
            id: user[0].id,
            firstname: user[0].firstname,
            lastname: user[0].lastname,
            status: user[0].status,
            nickName: user[0].nickName,
          }),
        });
        stompClient.publish({
          destination: "/user/public",
          headers: {},
          body: JSON.stringify({
            id: user[0].id,
            firstname: user[0].firstname,
            lastname: user[0].lastname,
            status: user[0].status,
            nickName: user[0].nickName,
          }),
        });
      },

      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div className="w-full h-screen container mx-auto flex flex-col items-center justify-center gap-2">
      <ChatClose client={client} id={user[0].id} />
      <p className="text-4xl text-gray-900 dark:text-white">My Messages</p>
      <ul className="max-w-md divide-y divide-gray-700 w-full list-none">
        {group.map((gr, index) => (
          <li className="pb-3 sm:pb-4">
            {" "}
            <Link
              href={`/chat/chat/${gr.senderId}/${gr.recipientId}`}
              key={index}
            >
              <UserMessageItem group={gr} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserMessageList;
