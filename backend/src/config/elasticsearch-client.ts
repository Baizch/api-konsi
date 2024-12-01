import { Client } from '@elastic/elasticsearch';

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'https://elasticsearch:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || '2XmfUxpGy6wjvfD9l5c_',
  },
  tls: {
    rejectUnauthorized: false,
  },
  maxRetries: 5,
  requestTimeout: 120000,
  sniffOnStart: true,
});

console.log('Connecting to Elasticsearch');

export const indexData = async (index: string, id: string, body: object) => {
  try {
    console.log('Verifying if index exists');
    const indexExists = await elasticClient.indices.exists({ index });

    if (!indexExists) {
      await elasticClient.indices.create({ index });
    }

    const response = await elasticClient.index({
      index,
      id,
      body,
    });

    await elasticClient.indices.refresh({ index });

    return response;
  } catch (error) {
    console.error(`Error indexing data in Elasticsearch: ${error}.`);
  }
};

export const searchData = async (index: string, query: object) => {
  try {
    const indexExists = await elasticClient.indices.exists({
      index: 'benefits',
    });

    if (!indexExists) {
      console.log(`Index ${index} does not exist. Creating it.`);
      await elasticClient.indices.create({ index: 'benefits' });
    }

    const response = await elasticClient.search({
      index,
      body: { query },
    });

    return response.hits.hits.map((hit: any) => hit._source);
  } catch (error) {
    console.error(`Error searching data in Elasticsearch:: ${error.message}.`);
  }
};

console.log('Connected to Elasticsearch');
