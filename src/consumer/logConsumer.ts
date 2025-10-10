import amqp from "amqplib";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "logs";

async function startConsumer() {
  try {
    console.log("🚀 Starting LogLens consumer service...");

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log("🔗 Connected to RabbitMQ");
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`📡 Listening on queue: ${QUEUE_NAME}`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;
        try {
          const logData = JSON.parse(msg.content.toString());
          console.log("📥 Received log:", logData);

          await prisma.log.create({
            data: {
              service: logData.service || "default",
              level: logData.level || "INFO",
              message: logData.message,
              timestamp: new Date(logData.timestamp || Date.now()),
            },
          });

          channel.ack(msg);
          console.log("✅ Log saved to DB");
        } catch (err) {
          console.error("❌ Error processing message:", err);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("💥 RabbitMQ consumer failed to start:", err);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("🧹 Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

startConsumer();
