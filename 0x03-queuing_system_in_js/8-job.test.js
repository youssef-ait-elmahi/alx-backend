import { describe, it} from 'mocha';
import { expect } from 'chai';
import createPushNotificationsJobs from './8-job';

describe('createPushNotificationsJobs', () => {
  it('should create jobs for each item in the array', () => {
    const jobs = [{ data: 'job1' }, { data: 'job2' }];
    const queue = {
      create: (type, data) => ({
        id: Math.random(),
        on: (event, callback) => {
          if (event === 'complete') callback();
          if (event === 'failed') callback('Error message');
          if (event === 'progress') callback(50, { progressData: 'some data' });
        },
        save: (saveCallback) => {
          saveCallback();
        },
      }),
    };

    createPushNotificationsJobs(jobs, queue);

  });

  it('should throw an error if jobs parameter is not an array', () => {
    const invalidJobs = 'not an array';
    const queue = {
      create: () => ({
        save: (saveCallback) => {
          saveCallback();
        },
      }),
    };

    const testFunction = () => createPushNotificationsJobs(invalidJobs, queue);
    expect(testFunction).to.throw('Jobs is not an array');
  });
});
