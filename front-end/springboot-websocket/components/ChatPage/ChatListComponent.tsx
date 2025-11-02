"use client";
import { Message, initilier } from "@/entities/EntityList";
import React, { useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";
import { API_BASE } from "@/lib/config";

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
    const controller = new AbortController();
    fetch(`${API_BASE}/messages/${senderId}/${recipientId}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data as Message[]);
        console.log(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Fetch messages failed", err);
      });
    return () => controller.abort();
  }, [senderId, recipientId]);

  // Keep scrolled to bottom when messages update
  useEffect(() => {
    if (!messageEl.current) return;
    messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight,
      behavior: "smooth",
    });
  }, [photos]);

  useEffect(() => {
    if (!lastMessage || lastMessage.id === 0 || !lastMessage.content) return;
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
