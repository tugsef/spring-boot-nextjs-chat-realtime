"use client";
import { Message } from "@/entities/EntityList";
import React, { useEffect, useState } from "react";
import UserMessageItem from "./UserMessageItem";
import Link from "next/link";
import { userList } from "@/data/User";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatClose from "../ChatClose";
import { API_BASE, WS_URL } from "@/lib/config";

function UserMessageList({ id }: { id: string }) {
  const [group, setGroup] = useState<Message[]>([]);
  const user = userList.find((item) => item.nickName === id);

  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/group/${user.id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setGroup(data);
      });
    const socket = new SockJS(WS_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected");
        if (user) {
          stompClient.publish({
            destination: "/app/user.addUser",
            headers: {},
            body: JSON.stringify({
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              status: user.status,
              nickName: user.nickName,
            }),
          });
          stompClient.publish({
            destination: "/user/public",
            headers: {},
            body: JSON.stringify({
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              status: user.status,
              nickName: user.nickName,
            }),
          });
        }
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
  }, [id]);

  return (
    <div className="w-full h-screen container mx-auto flex flex-col items-center justify-center gap-2">
      {user ? <ChatClose client={client} id={user.id} /> : null}
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
      {!user && (
        <p className="text-sm text-red-400">User not found. Please go back and enter a valid nickname.</p>
      )}
    </div>
  );
}

export default UserMessageList;
