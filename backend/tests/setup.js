import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Cafe } from '../src/models/Cafe.js';
import { Category } from '../src/models/Category.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await Promise.all([
    User.syncIndexes(),
    Cafe.syncIndexes(),
    Category.syncIndexes(),
    Product.syncIndexes(),
  ]);
}, 120000);

afterEach(async () => {
  const collections = mongoose.connection.collections;

  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});
