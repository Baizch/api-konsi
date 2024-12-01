import { readFileSync } from 'fs';
import { Channel } from 'amqplib';

export const sendCpfsToQueue = async (channel: Channel) => {
  try {
    const fileData = readFileSync('src/data/cpfs.json', 'utf-8');
    const cpfs: string[] = JSON.parse(fileData);

    cpfs.forEach((cpf: string) => {
      channel.sendToQueue('cpf_queue', Buffer.from(cpf));
      console.log(`CPF ${cpf} sent to queue`);
    });

    console.log('CPFs sent to queue successfully.');
  } catch (error) {
    console.error(
      'There was an error trying to read from file or send to queue',
      error
    );
  }
};
