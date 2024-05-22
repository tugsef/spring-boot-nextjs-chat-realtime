"use client";
import { Message, initilier } from "@/entities/EntityList";
import React, { useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";

function ChatListComponent({
  lastMessage,
  senderId,
  recipientId,
}: {
  lastMessage: Message;
  senderId: number;
  recipientId: number;
}) {
  const messageEl = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<Message[]>(initilier);

  useEffect(() => {
    fetch(`http://localhost:8080/messages/${senderId}/${recipientId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPhotos(data as Message[]);
        console.log(data);
      });
  }, []);

  useEffect(() => {
    if (messageEl && messageEl.current) {
      messageEl.current.addEventListener("DOMNodeInserted", (event: Event) => {
        const target = event.currentTarget as HTMLDivElement;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }

    return () => {
      if (messageEl && messageEl.current) {
        messageEl.current.removeEventListener(
          "DOMNodeInserted",
          (event: Event) => {
            const target = event.currentTarget as HTMLDivElement;
            target.scroll({ top: target.scrollHeight, behavior: "smooth" });
          }
        );
      }
    };
  }, []);

  useEffect(() => {
    setPhotos((prev) => [...prev, lastMessage]);
  }, [lastMessage]);

  // Yeni bir mesaj eklendiğinde scroll'u en aşağıda tut

  return (
    <div
      ref={messageEl}
      className="container mx-auto pb-14 bg-[#EEF7FF] rounded-xl shadow p-6 overflow-auto my-2 flex flex-col gap-2  overflow-y-auto h-[650px]"
    >
      {photos.map((item, index) => {
        return (
          <ChatItem
            key={index}
            item={item}
            senderId={senderId}
            recipientId={recipientId}
          />
        );
      })}
    </div>
  );
}

export default ChatListComponent;
