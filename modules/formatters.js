
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
  formatted.jobDateString = moment(formatted.jobDate).format('dddd, MMMM D, YYYY');

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

export function formatTipSummary(tipSummary) {
  const formatted = {
    ...tipSummary,
    month: new Date(tipSummary.month),
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

  formatted.monthString = moment(formatted.month).utc().format('MMMM YYYY');

  return formatted;
}
