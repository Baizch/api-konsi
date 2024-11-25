import express from 'express';
import dotenv from 'dotenv';
import generateTokenRoute from './routes/generate-token';
import getBenefitsRoute from './routes/get-benefits';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/v1', generateTokenRoute);
app.use('/api/v1', getBenefitsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
