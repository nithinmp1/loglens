import { LogType } from "./types.ts";
import { WebSocket, WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { GraphQLSchema } from "graphql";

const subscribers: ((log: any) => void)[] = [];

export function publishLog(log: any) {
  const count = subscribers.length;
  subscribers.forEach((resolve) => resolve(log));
  subscribers.length = 0;
  // wsServer?.publishLog?.(log);

  console.log(`[publishLog] Sent log to ${count} in-process subscribers`, log);
  return { delivered: count, log };
}

export const newLogSubscription = {
  type: LogType,
  subscribe: (_: any, __: any) => {
    return {
      [Symbol.asyncIterator]: async function* () {
        while (true) {
          const log = await new Promise((resolve) => subscribers.push(resolve));
          yield { newLog: log };
        }
      },
    };
  },
  resolve: (payload: any) => payload.newLog,
};

type WsServerWithPublish = ReturnType<typeof useServer> & { publishLog?: (log: any) => void };
let wsServer: WsServerWithPublish | undefined;

export function setupWebSocketServer(schema: GraphQLSchema, port = 4001) {
  const wss = new WebSocketServer({
    port,
    path: "/graphql",
  });

  const server = useServer({ schema }, wss);
  (server as WsServerWithPublish).publishLog = (log: any) => {
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     try {
    //       client.send(JSON.stringify({ type: "next", payload: { data: { newLog: log } } }));
    //     } catch (err) {
    //       console.error("Failed to send log to client", err);
    //     }
    //   }
    // });
    subscribers.forEach((resolve) => resolve(log));
  };

  wsServer = server as WsServerWithPublish;
  wsServer = server as any;
  console.log("🟢 WebSocket subscription server ready at /graphql");
  return wsServer;
}
