"use client";
import { useEffect, useMemo, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export type SubscriptionSpec = {
  destination: string;
  handler: (data: any, raw: IMessage) => void;
};

export function useStompClient(
  wsUrl: string,
  subscriptionsFactory: () => SubscriptionSpec[],
  deps: any[] = []
) {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(wsUrl);
    const c = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        setConnected(true);
        const subs = subscriptionsFactory();
        subs.forEach((s) =>
          c.subscribe(s.destination, (message) => {
            let parsed: any = undefined;
            try {
              parsed = JSON.parse(message.body);
            } catch {
              parsed = message.body;
            }
            s.handler(parsed, message);
          })
        );
      },
      onDisconnect: () => setConnected(false),
    });

    c.activate();
    setClient(c);

    return () => {
      c.deactivate();
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, ...deps]);

  const publish = (destination: string, body: any) => {
    if (!client) return;
    client.publish({ destination, body: JSON.stringify(body) });
  };

  return { client, connected, publish };
}
