
import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import * as Papa from 'papaparse';

import { calculateDuration, getDateFromTime } from './formatters';
import DAO from '../dao/DAO';

const jobDao = DAO.get(DAO.JOB);
const tipDao = DAO.get(DAO.TIP);

export async function clearData() {
  await tipDao.drop();
  await jobDao.drop();
  await jobDao.init();
  await tipDao.init();
}

async function loadAndParseUrl(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      error: (error) => {
        reject(error);
      },
      complete: (results) => {
        resolve(results);
      }
    });
  });
}

/*
"Job Name",
"Tip Amount",
"Tip Out",
"Hours",
"Work Date",
"Clock In",
"Clock Out",
"Sales",
"Credit Card Tips",
"Notes"
*/

const jobMap = new Map();

async function getOrCreateJob(jobName) {
  if (jobMap.has(jobName)) {
    return jobMap.get(jobName);
  }

  const job = await jobDao.create({
    name: jobName,
    rate: 0,
    clockIn: '18:00',
    clockOut: '02:00',
    defaultJob: false
  });

  jobMap.set(jobName, job);

  return job;
}

let headers;
function getColumnData(data, name, defaultValue) {
  const value = data[_.indexOf(headers, name)];
  if (_.isNil(value)) {
    return defaultValue;
  }
  return value.trim();
}

const clockRegEx = /[0-9]{4}-[0-9]{2}-[0-9]{2} ([0-9]{2}:[0-9]{2}):[0-9]{2}.[0-9]{3}/;

function parseClockTime(dateString) {
  if (!dateString) {
    return '';
  }

  const matches = dateString.match(clockRegEx);
  if (matches.length > 1) {
    return matches[1];
  }
  return '';
}

export async function importData(url) {
  jobMap.clear();

  const results = await loadAndParseUrl(url);

  await Promise.each(results.data, async (data, ndx) => {
    if (ndx === 0) {
      headers = data;
      return;
    }

    const jobName = getColumnData(data, 'Job Name');
    if (_.isEmpty(jobName)) {
      return;
    }

    const job = await getOrCreateJob(jobName);

    const workDate = getColumnData(data, 'Work Date', null);
    const jobDate = moment(workDate).startOf('day').toDate();

    const amount = parseFloat(getColumnData(data, 'Tip Amount', 0), 10);
    const sales = parseFloat(getColumnData(data, 'Sales', 0), 10);
    const ccTips = parseFloat(getColumnData(data, 'Credit Card Tips', 0), 10);
    const tipOut = parseFloat(getColumnData(data, 'Tip Out', 0), 10);
    const clockIn = parseClockTime(getColumnData(data, 'Clock In', null));
    const clockOut = parseClockTime(getColumnData(data, 'Clock Out', null));

    const clockInDate = getDateFromTime(clockIn);
    const clockOutDate = getDateFromTime(clockOut);
    const duration = calculateDuration(clockInDate, clockOutDate);

    const notes = getColumnData(data, 'Notes', '');

    const tip = {
      jobId: job.id,
      jobDate,
      amount,
      sales,
      ccTips,
      tipOut,
      clockIn,
      clockOut,
      duration,
      notes
    }

    await tipDao.create(tip);
  });
}
