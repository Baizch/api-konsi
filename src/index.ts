import dotenv from 'dotenv';
import express from 'express';
import { Channel } from 'amqplib';
import { getChannel } from './config/rabbitmq-client';
import { startConsuming } from './utils/consume-from-queue';
import { sendCpfsToQueue } from './utils/send-to-queue';
import generateTokenRoute from './routes/generate-token';
import getBenefitsRoute from './routes/get-benefits';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;
let channel: Channel;

app.use(express.json());

app.use('/api/v1', generateTokenRoute);
app.use('/api/v1', getBenefitsRoute);

const initializeApp = async () => {
  try {
    channel = await getChannel();

    if (channel) {
      await sendCpfsToQueue(channel);

      await startConsuming(channel);
    }
  } catch (error) {
    console.error('Error during application initialization:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeApp();
});
