// Food Tailor — DynamoDB Client & Table Management
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const TABLE_NAME = env.DYNAMODB_TABLE_NAME || 'food_tailor';

const clientConfig = {
  region: env.AWS_REGION || 'us-east-1',
};

if (env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = env.DYNAMODB_ENDPOINT;
  clientConfig.credentials = {
    accessKeyId: env.AWS_ACCESS_KEY_ID || 'localKey',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || 'localSecret',
  };
} else if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  };
}

export const rawDynamoClient = new DynamoDBClient(clientConfig);

export const docClient = DynamoDBDocumentClient.from(rawDynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

let dynaliteServer = null;

/**
 * Starts an in-memory local DynamoDB server using dynalite if local endpoint is configured
 * and no external DynamoDB instance is listening.
 */
export async function startLocalDynamoIfRequested() {
  if (!env.DYNAMODB_ENDPOINT || env.isProd) return;

  const url = new URL(env.DYNAMODB_ENDPOINT);
  const port = parseInt(url.port || '8000', 10);

  try {
    // Check if already running
    const res = await fetch(`${env.DYNAMODB_ENDPOINT}`, { method: 'POST', body: '{}' }).catch(() => null);
    if (res) {
      logger.info(`DynamoDB local endpoint ${env.DYNAMODB_ENDPOINT} is already reachable`);
      return;
    }
  } catch {
    // Port not open
  }

  try {
    const dynaliteModule = await import('dynalite');
    const dynalite = dynaliteModule.default || dynaliteModule;
    dynaliteServer = dynalite({ createTableMs: 0 });

    await new Promise((resolve, reject) => {
      let resolved = false;
      dynaliteServer.once('error', (err) => {
        if (!resolved) {
          resolved = true;
          if (err.code === 'EADDRINUSE') {
            logger.info(`DynamoDB local port ${port} is already in use`);
            resolve();
          } else {
            reject(err);
          }
        }
      });
      dynaliteServer.listen(port, (err) => {
        if (!resolved) {
          resolved = true;
          if (err) {
            if (err.code === 'EADDRINUSE') {
              logger.info(`DynamoDB local port ${port} is already in use`);
              resolve();
            } else {
              reject(err);
            }
          } else {
            logger.info(`🚀 In-memory DynamoDB local running on port ${port}`);
            resolve();
          }
        }
      });
    });
  } catch (err) {
    logger.warn('Could not launch in-memory dynalite instance:', { error: err.message });
  }
}

/**
 * Stops in-memory dynalite server if running
 */
export async function stopLocalDynamo() {
  if (dynaliteServer) {
    await new Promise((resolve) => dynaliteServer.close(resolve));
    dynaliteServer = null;
    logger.info('In-memory DynamoDB local stopped');
  }
}

/**
 * Check if DynamoDB connection is working
 */
export async function checkDynamoConnection() {
  try {
    const res = await rawDynamoClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return res.Table?.TableStatus === 'ACTIVE' ? 'connected' : (res.Table?.TableStatus || 'connected');
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') {
      return 'table_not_found';
    }
    // Attempt list tables
    try {
      await rawDynamoClient.send(new ListTablesCommand({}));
      return 'connected_no_table';
    } catch {
      return 'disconnected';
    }
  }
}

/**
 * Create Single-Table schema if it does not already exist
 */
export async function ensureTableExists() {
  try {
    await rawDynamoClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return true;
  } catch (err) {
    if (err.name !== 'ResourceNotFoundException') {
      logger.error(`Error describing DynamoDB table ${TABLE_NAME}:`, err);
      throw err;
    }
  }

  logger.info(`Creating DynamoDB table ${TABLE_NAME}...`);

  const createParams = {
    TableName: TABLE_NAME,
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' },
      { AttributeName: 'GSI2PK', AttributeType: 'S' },
      { AttributeName: 'GSI2SK', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
      {
        IndexName: 'GSI2',
        KeySchema: [
          { AttributeName: 'GSI2PK', KeyType: 'HASH' },
          { AttributeName: 'GSI2SK', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  // Dynalite doesn't support PAY_PER_REQUEST billing mode in some versions, provisioned handles both
  try {
    delete createParams.ProvisionedThroughput;
    await rawDynamoClient.send(new CreateTableCommand(createParams));
  } catch (payPerReqErr) {
    createParams.ProvisionedThroughput = { ReadCapacityUnits: 5, WriteCapacityUnits: 5 };
    delete createParams.BillingMode;
    await rawDynamoClient.send(new CreateTableCommand(createParams));
  }

  logger.info(`✅ DynamoDB table ${TABLE_NAME} successfully created with GSI1 and GSI2.`);
  return true;
}
