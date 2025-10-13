import { createClient } from "graphql-ws";
import WebSocket from "ws";

const client = createClient({
  url: "ws://localhost:4001/graphql",
  webSocketImpl: WebSocket,
  connectionAckWaitTimeout: 5000, // Wait max 5s for server ack
});
console.log("👂 Attempting to connect to subscription server...");

client.subscribe(
  {
    query: `
      subscription {
        newLog {
          id
          service
          level
          message
          timestamp
        }
      }
    `,
  },
  {
    next: (data) => console.log("📡 New log received:", data.data?.newLog),
    error: (err) => {
      console.error("❌ Subscription error:", err);
    },
    complete: () => console.log("✅ Subscription complete"),
  }
);
