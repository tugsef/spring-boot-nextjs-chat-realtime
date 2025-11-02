"use client";
import { Message } from "@/entities/EntityList";

function ChatItem({
  item,
  senderId,
}: {
  senderId: number;
  item: Message;
  recipientId: number;
}) {
  return (
    <div
      className={`flex  gap-2.5 ${
        item.senderId === senderId ? "justify-end" : "justify-start"
      }`}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={`${
          item.senderId === senderId ? "/img/stefan.svg" : "/img/zoe.svg"
        }`}
        alt="Jese image"
      />
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${
          item.senderId === senderId ? "bg-gray-700" : "bg-gray-500"
        } rounded-e-xl rounded-es-xl`}
      >
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {item.content}
        </p>
      </div>
    </div>
  );
}

export default ChatItem;
