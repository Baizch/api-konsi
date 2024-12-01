import { Channel } from 'amqplib';
import { searchData } from '../config/elasticsearch-client';
import { getBenefitsService } from '../services/get-benefits';

export const startConsuming = async (channel: Channel) => {
  try {
    const PREFETCH_COUNT = 1;

    await channel.prefetch(PREFETCH_COUNT);

    channel.consume('cpf_queue', async (msg) => {
      if (msg) {
        const cpf = msg.content.toString();
        console.log(`Consuming CPF: ${cpf}`);

        try {
          const elasticsearchResults = await searchData('benefits', {
            match: {
              _id: cpf,
            },
          });

          if (elasticsearchResults.length > 0) {
            console.log(`Data found for CPF: ${cpf}`);
            return elasticsearchResults;
          } else {
            console.log(`No data found for CPF: ${cpf}`);
            await getBenefitsService(cpf);
          }
        } catch (error) {
          console.error(`Error processing CPF: ${cpf}`, error);
        } finally {
          channel.ack(msg);
        }
      }
    });

    console.log('Consumer is running and waiting for messages...');
  } catch (error) {
    console.error('Error starting consumer:', error);
  }
};
