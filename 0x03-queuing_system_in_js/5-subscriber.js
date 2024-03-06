import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('connect', function () {
    console.log('Redis client connected to the server');
});

redisClient.on('error', function (error) {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

redisClient.subscribe('holberton school channel');

redisClient.on('message', function (channel, message) {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    redisClient.unsubscribe('holberton school channel');
    redisClient.end(true);
  }
});
