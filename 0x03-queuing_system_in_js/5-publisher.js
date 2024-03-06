import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('connect', function () {
    console.log('Redis client connected to the server');
});

redisClient.on('error', function(error) {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

function publishMessage(message, time) {
  setTimeout(function () {
    console.log(`About to send ${message}`);
    redisClient.publish('holberton school channel', message);
  }, time);
}

publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
