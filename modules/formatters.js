
import _ from 'lodash';
import moment from 'moment-timezone';

export function getDateFromTime(time) {
  if (time) {
    return new Date(moment().format(`YYYY-MM-DDT${time}:00Z`));
  }
  return new Date();
}

function formatTime(time) {
  const clockFormat = 'h:mm a';
  return moment(time).format(clockFormat);
}

/**
 * Calcualte the hours from clock in to clock out.
 * @param {Date} clockInDate
 * @param {Date} clockOutDate
 * @return {number}
 */
export function calculateDuration(clockInDate, clockOutDate) {
  // @TODO optionally round to nearest 15 mins
  const duration = (clockOutDate - clockInDate) / (60 * 60 * 1000);
  if (duration < 0) {
    return 24 + duration;
  }
  return duration;
}

function floatFormat(value) {
  if (_.isNumber(value)) {
    return value.toFixed(2);
  }
  return '';
}

export function makeEmptyJob() {
  return {
    name: '',
    rate: 0.00,
    clockIn: '08:00',
    clockOut: '17:00',
    defaultJob: false
  };
}

/**
 * Format the job for display.
 * @param {object} job
 * Return {object}
 */
export function formatJob(job) {
  if (!job) {
    return null;
  }

  const formatted = {
    ...job,
    defaultJob: job.defaultJob ? true : false
  };

  formatted.rateString = '';
  if (!_.isNil(formatted.rate)) {
    formatted.rateString = floatFormat(formatted.rate);
  }

  formatted.clockInDate = getDateFromTime(formatted.clockIn);
  formatted.clockOutDate = getDateFromTime(formatted.clockOut);
  formatted.clockInString = formatTime(formatted.clockInDate);
  formatted.clockOutString = formatTime(formatted.clockOutDate);

  formatted.duration = calculateDuration(formatted.clockInDate, formatted.clockOutDate);
  formatted.durationString = floatFormat(formatted.duration);

  return formatted;
}

export function formatTip(tip) {
  const formatted = {
    ...tip
  };

  if (formatted.job) {
    formatted.jobId = formatted.job.id;
    formatted.jobName = formatted.job.name;
  }

  formatted.jobDate = new Date(tip.jobDate);
  formatted.jobDateString = moment(formatted.jobDate).format('ddd, MMM D, YYYY');

  formatted.clockInDate = getDateFromTime(formatted.clockIn);
  formatted.clockOutDate = getDateFromTime(formatted.clockOut);
  formatted.clockInString = formatTime(formatted.clockInDate);
  formatted.clockOutString = formatTime(formatted.clockOutDate);

  formatted.duration = calculateDuration(formatted.clockInDate, formatted.clockOutDate);
  formatted.durationString = floatFormat(formatted.duration);

  formatted.amountString = `$${floatFormat(formatted.amount)}`;
  formatted.salesString = `$${floatFormat(formatted.sales)}`;

  formatted.tipRate = formatted.amount / formatted.duration;
  formatted.tipRateString = `$${floatFormat(formatted.tipRate)} / hr`;

  formatted.tipPercent = formatted.amount / formatted.sales * 100;
  formatted.tipPercentString = `${floatFormat(formatted.tipPercent)}%`;

  formatted.wages = formatted.jobRate * formatted.duration;
  formatted.wagesString = `$${floatFormat(formatted.wages)}`;

  return formatted;
}

export function makeEmptyTip(defaultJob) {
  const tip = {
    jobDate: new Date(),
    amount: 0.00,
    sales: 0.00,
    ccTips: 0.00,
    tipOut: 0.00,
  };

  if (defaultJob) {
    tip.jobId = defaultJob.id;
    tip.jobName = defaultJob.name;
    tip.job = defaultJob;
    tip.clockIn = defaultJob.clockIn;
    tip.clockOut = defaultJob.clockOut;
  }

  return formatTip(tip);
}

export function formatTipSummary(tipSummary) {
  const monthDate = new Date(tipSummary.month);
  const formatted = {
    ...tipSummary,
    amountSum: `$${floatFormat(tipSummary.amountSum)}`,
    amountAvg: `$${floatFormat(tipSummary.amountAvg)}`,
    salesSum: `$${floatFormat(tipSummary.salesSum)}`,
    salesAvg: `$${floatFormat(tipSummary.salesAvg)}`,
    tipPercenAvg: `${floatFormat(tipSummary.tipPercenAvg)}%`,
    tipRateAvg: `$${floatFormat(tipSummary.tipRateAvg)} / hr`,
    hoursSum: floatFormat(tipSummary.hoursSum),
    hoursAvg: floatFormat(tipSummary.hoursAvg),
    wagesSum: `$${floatFormat(tipSummary.wagesSum)}`,
    wagesAvg: `$${floatFormat(tipSummary.wagesAvg)}`,
    tips: []
  };

  const monthDateUtc = moment(monthDate).utc();
  formatted.monthDate = monthDateUtc.toDate();
  formatted.year = monthDateUtc.get('year');
  formatted.month = monthDateUtc.get('month') + 1;
  formatted.monthString = monthDateUtc.format('MMMM YYYY');

  return formatted;
}
