const CONFIG = require('./../config'); // Load config (environment)
const { LEVEL } = require('./../config/constants').logGas;
const mongoose = require('mongoose'); // Load mongoose
const { logger } = require('./../utils/logger')
const db = mongoose.connection; // Bootstrap db connection

const MONGO_OPTION = {
  poolSize: Number(CONFIG.MONGO.OPTION.POOL_SIZE),
  bufferMaxEntries: Number(CONFIG.MONGO.OPTION.BUFFER_MAX_ENTRIES),
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: CONFIG.MONGO.OPTION.AUTH,
  serverSelectionTimeoutMS: CONFIG.MONGO.OPTION.TIMEOUT
}

// logger.info(`Starting: API PORT : ${CONFIG.PORT}`);
// logger.info(`Connecting to MongoDB Instance: ${CONFIG.MONGO.CONNECT}`);

// logger.detail.console(LEVEL.INFO, `Starting: API PORT : ${CONFIG.PORT}`);
// logger.detail.console(LEVEL.INFO, `Connecting to MongoDB Instance: ${CONFIG.MONGO.CONNECT}`);

mongoose.connect(CONFIG.MONGO.CONNECT, MONGO_OPTION);

db.on('connecting', () => {
  // logger.info('connecting to MongoDB...');
});

db.on('error', (error) => {
  // logger.info(error.stack);
  // logger.detail.console(LEVEL.INFO, 'Could not connect to MongoDB!', error);
  // logger.detail.console(LEVEL.INFO, error);
  // logger.info(`Connecting to MongoDB Instance: ${CONFIG.MONGO.CONNECT}`);
  mongoose.connect(CONFIG.MONGO.CONNECT, MONGO_OPTION);
  mongoose.disconnect();
});

db.on('connected', () => {
  // logger.info('MongoDB connected!');
  // logger.detail.console(LEVEL.INFO, 'MongoDB connected!');
});

db.once('open', () => {
  // logger.info('MongoDB connection opened!');
  // logger.detail.console(LEVEL.INFO, 'MongoDB connection opened!');
});

db.on('reconnected', () => {
  // logger.info('MongoDB reconnected!');
  // logger.detail.console(LEVEL.INFO, 'MongoDB reconnected!');
});

db.on('disconnected', () => {
  // logger.info('MongoDB disconnected!');
  // logger.detail.console(LEVEL.INFO, 'MongoDB disconnected!');
});

process.on('uncaughtException', (err) => {
  // logger.info(err);
  process.exit(1);
});