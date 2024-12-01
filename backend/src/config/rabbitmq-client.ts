import amqp, { Channel, Connection } from 'amqplib';

let channel: Channel;
let connection: Connection;

export const getChannel = async (): Promise<Channel> => {
  if (channel) return channel;

  const initialDelay = 8000;
  const retryInterval = 5000;

  await new Promise((resolve) => setTimeout(resolve, initialDelay));

  try {
    console.log('Connecting to RabbitMQ');

    connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'
    );

    channel = await connection.createChannel();

    console.log('Declaring the queue: cpf_queue...');
    await channel.assertQueue('cpf_queue', { durable: true });

    console.log(
      'RabbitMQ channel initialized and queue declared successfully.'
    );
    return channel;
  } catch (error) {
    console.error(
      `Error connecting to RabbitMQ: ${error.message}. Retrying in ${
        retryInterval / 1000
      } seconds...`
    );
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }
};

export const sendToQueue = async (cpf: string): Promise<void> => {
  const channel = await getChannel();
  channel.sendToQueue('cpf_queue', Buffer.from(cpf));
  console.log(`CPF ${cpf} sent to queue`);
};
