// Initialize DynamoDB Single-Table schema
import { startLocalDynamoIfRequested, ensureTableExists, checkDynamoConnection, TABLE_NAME } from './dynamoClient.js';
import { logger } from '../utils/logger.js';

export async function initDatabase() {
  await startLocalDynamoIfRequested();
  await ensureTableExists();
  const status = await checkDynamoConnection();
  logger.info(`DynamoDB table ${TABLE_NAME} initialized with status: ${status}`);
  return status;
}

if (process.argv[1]?.endsWith('initTables.js')) {
  initDatabase()
    .then((status) => {
      console.log(`✅ DynamoDB initialized: ${status}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Failed to initialize DynamoDB:', err);
      process.exit(1);
    });
}
