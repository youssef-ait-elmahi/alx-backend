import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import express from 'express';

const redisClient = createClient();

redisClient.on('connect', function() {
  console.log('Redis client connected to the server');
});

redisClient.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

const promisifiedGet = promisify(redisClient.get).bind(redisClient);

function reserveSeat(number) {
  redisClient.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
  return (await promisifiedGet('available_seats'));
}

let reservationEnabled = true;
const queue = createQueue();

const app = express();

app.get('/available_seats', async function (req, res) {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({"numberOfAvailableSeats": availableSeats});
});

app.get('/reserve_seat', function (req, res) {
  if (!reservationEnabled) res.json({"status": "Reservation are blocked"});

  const job = queue.create('reserve_seat', {'seat': 1}).save((error) => {
    if (error) res.json({"status": "Reservation failed"});
    else {
      res.json({"status": "Reservation in process"});
      job.on('complete', function () {
      console.log(`Seat reservation job ${job.id} completed`);
      });
      job.on('failed', function(error) {
        console.log(`Seat reservation job ${job.id} failed: ${error}`);
      });
    }
  });
});

app.get('/process', function (req, res) {
    res.json({"status": "Queue processing"});
    queue.process('reserve_seat', async function(job, done) {
	const seat = Number(await getCurrentAvailableSeats());
	if (seat === 0) {
	    reservationEnabled = false;
	    done(Error('Not enough seats available'));
	} else {
	    reserveSeat(seat - 1);
	    done();
	}
    });
});

const port = 1245;
app.listen(port, () => {
    console.log(`app is listening http://localhost:${port}`);
});
reserveSeat(50);
