import { Request, Response } from 'express';
import { sendToQueue } from '../config/rabbitmq-client';
import { searchData } from '../config/elasticsearch-client';

export const getBenefitsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cpf } = req.query;

    if (!cpf) {
      res.status(400).json({
        success: false,
        message: 'CPF is required.',
      });
      return;
    }

    const elasticsearchResults = await searchData('benefits', {
      match: {
        _id: cpf,
      },
    });

    if (elasticsearchResults.length > 0) {
      console.log(`Data found in Elasticsearch for CPF: ${cpf}`);
      console.log(elasticsearchResults);

      res.status(200).json({
        success: true,
        data: elasticsearchResults,
      });
      return;
    }

    console.log(`Data not found for CPF: ${cpf}. Adding to RabbitMQ queue.`);
    await sendToQueue(cpf as string);

    res.status(202).json({
      success: true,
      message: 'Data is being processed. Wait a moment please',
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
