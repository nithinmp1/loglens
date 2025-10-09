import * as amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://loglens:loglens@localhost:5672');
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('❌ Failed to connect RabbitMQ:', error);
    throw error;
  }
};

export const getChannel = () => channel;
