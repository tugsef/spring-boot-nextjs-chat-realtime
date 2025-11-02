"use client";
import { User, fetchUserById } from "@/data/User";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function ChatClose({ client, id }: { client: any; id: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUserById(id).then((fetchedUser) => {
      setUser(fetchedUser);
    });
  }, [id]);

  const exitClose = () => {
    if (client && user) {
      client.publish({
        destination: "/app/user.disconnectUser",
        headers: {},
        body: JSON.stringify({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          status: user.status,
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
