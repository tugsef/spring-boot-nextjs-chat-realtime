"use client";
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatListComponent from "@/components/ChatPage/ChatListComponent";
import { Message } from "@/entities/EntityList";
import ChatClose from "@/components/ChatClose";
import { WS_URL } from "@/lib/config";

export default function page() {
  const [messages, setMessages] = useState<Message>({} as Message);
  const [input, setInput] = useState<any>("");
  const [client, setClient] = useState<any>(null);
  const [testMessage, setTestMessage] = useState({
    id: 1,
    senderId: 3,
    recipientId: 4,
  });

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected");
        stompClient.subscribe(
          `/user/${testMessage.id}/queue/messages`,
          (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages({
              id: newMessage.id,
              content: newMessage.content,
              recipientId: newMessage.recipientId,
              senderId: newMessage.senderId,
            });
          }
        );
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
  }, [testMessage]);

  const sendMessage = () => {
    if (client && input) {
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          senderId: testMessage.senderId,
          recipientId: testMessage.recipientId,
          content: input,
          timestamp: Date.now(),
        }),
      });
      setInput("");
    }
  };
  return (
    // //Initialize Stomp connection, will use SockJS for http(s) and WebSocket for ws(s)
    // //The Connection can be used by all child components via the hooks or hocs.
    // <StompSessionProvider
    //   url={"http://localhost:8080/ws-message"}
    //   //All options supported by @stomp/stompjs can be used here
    // >
    //   <SubscribingComponent />
    // </StompSessionProvider>
    <>
      {" "}
      <ChatClose client={client} id={testMessage.senderId} />{" "}
      <div>
        <h1>WebSocket Chat</h1>

        <div>
          <input
            className="text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="content  "
          />
          <button onClick={sendMessage}>Send</button>
          Id:
          <input
            className="text-black"
            value={testMessage.id}
            onChange={(e) =>
              setTestMessage({ ...testMessage, id: Number(e.target.value) })
            }
            placeholder="id"
          />
          recipientId:
          <input
            className="text-black"
            value={testMessage.recipientId}
            onChange={(e) =>
              setTestMessage({
                ...testMessage,
                recipientId: Number(e.target.value),
              })
            }
            placeholder="recipientId"
          />
          senderId:
          <input
            type="text"
            className="text-black"
            value={testMessage.senderId}
            onChange={(e) =>
              setTestMessage({
                ...testMessage,
                senderId: Number(e.target.value),
              })
            }
            placeholder="senderId"
          />
        </div>
        {JSON.stringify(messages)}
        <ChatListComponent
          lastMessage={messages}
          recipientId={testMessage.recipientId}
          senderId={testMessage.senderId}
        />
      </div>
    </>
  );
}


