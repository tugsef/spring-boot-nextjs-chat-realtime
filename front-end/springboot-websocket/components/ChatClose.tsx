"use client";
import { userList } from "@/data/User";
import Link from "next/link";
import React from "react";

function ChatClose({ client, id }: { client: any; id: number }) {
  const user = userList.filter((item) => item.id === id);
  const exitClose = () => {
    if (client) {
      client.publish({
        destination: "/app/user.disconnectUser",
        headers: {},
        body: JSON.stringify({
          id: user[0].id,
          firstname: user[0].firstname,
          lastname: user[0].lastname,
          status: user[0].status,
          nickName: "OFFLINE",
        }),
      });
    }
  };

  return (
    <div className="w-full text-end">
      <Link href={"/"} className="flex justify-end" onClick={exitClose}>
        <span className="text-xl font-medium me-2 px-2.5 py-0.5 rounded bg-red-900 text-red-300">
          x
        </span>
      </Link>
    </div>
  );
}

export default ChatClose;
