"use client";
import { User } from "@/context/Chat/ChatContextTypes";
import { Message } from "@/entities/EntityList";
import React, { useEffect, useState } from "react";

function UserMessageItem({ group }: { group: Message }) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    fetch(`http://localhost:8080/user/id/${group.recipientId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUser(data);
        console.log(data);
      });
  }, []);

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex-shrink-0">
        <img
          className="w-8 h-8 rounded-full"
          src="/img/zoe.svg"
          alt="Neil image"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
          {user?.firstname}
        </p>
        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {user?.lastname}
        </p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        <div>
          <span
            className={`flex w-3 h-3 me-3  rounded-full ${
              user?.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default UserMessageItem;
