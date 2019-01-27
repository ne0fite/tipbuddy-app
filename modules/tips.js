import _ from 'lodash';
import moment from 'moment';

import { formatTip } from './formatters';
import DAO from '../dao/DAO';

const tipDao = DAO.get(DAO.TIP);

export const GET_TIPS = 'tipstash-app/tips/GET_TIPS';
export const GET_TIPS_SUCCESS = 'tipstash-app/tips/GET_TIPS_SUCCESS';
export const GET_TIPS_FAIL = 'tipstash-app/tips/GET_TIPS_FAIL';

export const GET_TIPS_SUMMARY = 'tipstash-app/tips/GET_TIPS_SUMMARY';
export const GET_TIPS_SUMMARY_SUCCESS = 'tipstash-app/tips/GET_TIPS_SUMMARY_SUCCESS';
export const GET_TIPS_SUMMARY_FAIL = 'tipstash-app/tips/GET_TIPS_SUMMARY_FAIL';

export const GET_TIP = 'tipstash-app/tips/GET_TIP';
export const GET_TIP_SUCCESS = 'tipstash-app/tips/GET_TIP_SUCCESS';
export const GET_TIP_FAIL = 'tipstash-app/tips/GET_TIP_FAIL';

export const SAVE_TIP = 'tipstash-app/tips/SAVE_TIP';
export const SAVE_TIP_SUCCESS = 'tipstash-app/tips/SAVE_TIP_SUCCESS';
export const SAVE_TIP_FAIL = 'tipstash-app/tips/SAVE_TIP_FAIL';

export const DELETE_TIP = 'tipstash-app/tips/DELETE_TIP';
export const DELETE_TIP_SUCCESS = 'tipstash-app/tips/DELETE_TIP_SUCCESS';
export const DELETE_TIP_FAIL = 'tipstash-app/tips/DELETE_TIP_FAIL';

const initialState = {
  activeSections: [],
  tips: [],
};

function percentChange(fromValue, toValue) {
  const change = (toValue - fromValue) / fromValue;
  return change;
}

const getJobSummaries = tips => (
  _.reduce(tips, (jobs, tip) => {
    const formattedTip = formatTip(tip);

    if (!_.has(jobs, formattedTip.jobId)) {
      jobs[formattedTip.jobId] = {
        id: formattedTip.jobId,
        jobName: formattedTip.jobName,
        amountSum: 0,
        salesSum: 0,
        tipPercentSum: 0,
        tipRateSum: 0,
        tipPercentAvg: 0,
        tipRateAvg: 0,
        tips: []
      };
    }
    const job = jobs[formattedTip.jobId];

    job.amountSum += formattedTip.amount;
    job.salesSum += formattedTip.sales;
    job.tipPercentSum += formattedTip.tipPercent;
    job.tipRateSum += formattedTip.tipRate;

    job.tips.push(formattedTip);

    job.numTips = _.size(job.tips);
    job.tipPercentAvg = job.tipPercentSum / job.numTips;
    job.tipRateAvg = job.tipRateSum / job.numTips;

    return jobs;
  }, {})
);

function handleGetTipSummarySuccess(state, action) {
  const {
    year,
    month,
    tips,
    tipSummaries
  } = action.payload;

  const formattedTipSummaries = _.map(tipSummaries, (tipSummary, ndx) => {
    const monthDate = moment(tipSummary.month);
    tipSummary.monthDate = monthDate.toDate();
    tipSummary.year = monthDate.get('year');
    tipSummary.month = monthDate.get('month') + 1;
    tipSummary.monthString = monthDate.format('MMMM YYYY');
    tipSummary.tips = [];

    if (ndx < (tipSummaries.length - 1)) {
      const prevTipSummary = tipSummaries[ndx + 1];
      tipSummary.amountChange = percentChange(prevTipSummary.amountSum, tipSummary.amountSum);
      tipSummary.amountSumChange = percentChange(prevTipSummary.amountSum, tipSummary.amountSum);
      tipSummary.amountAvgChange = percentChange(prevTipSummary.amountAvg, tipSummary.amountAvg);
      tipSummary.salesChange = percentChange(prevTipSummary.salesSum, tipSummary.salesSum);
      tipSummary.salesSumChange = percentChange(prevTipSummary.salesSum, tipSummary.salesSum);
      tipSummary.salesAvgChange = percentChange(prevTipSummary.salesAvg, tipSummary.salesAvg);
      tipSummary.tipPercentAvgChange = percentChange(
        prevTipSummary.tipPercentAvg,
        tipSummary.tipPercentAvg
      );
      tipSummary.tipRateAvgChange = percentChange(prevTipSummary.tipRateAvg, tipSummary.tipRateAvg);
    }
    return tipSummary;
  });

  const jobSummaries = getJobSummaries(tips);

  const activeTips = _.find(tipSummaries, { year, month });
  if (activeTips) {
    activeTips.tips = jobSummaries;
  }

  return {
    ...state,
    tips: formattedTipSummaries,
    year,
    month,
  };
}

function handleGetTipsSuccess(state, action) {
  const { tips: tipSummaries } = state;
  const { year, month, tips } = action.payload;

  const jobSummaries = getJobSummaries(tips);

  const activeTips = _.find(tipSummaries, { year, month });
  if (activeTips) {
    activeTips.tips = jobSummaries;
  }

  return {
    ...state,
    tips: tipSummaries,
    year,
    month,
  };
}

const tipsReducer = function tips(state = initialState, action) {
  switch (action.type) {
    case GET_TIPS_SUMMARY_SUCCESS:
      return handleGetTipSummarySuccess(state, action);
    case GET_TIPS_SUMMARY_FAIL:
      console.log('failed to get tips summaries', action.payload.error);
      break;

    case GET_TIPS_SUCCESS:
      return handleGetTipsSuccess(state, action);
    case GET_TIPS_FAIL:
      console.log('failed to get tips by month', action.payload.error);
      break;

    case GET_TIP_SUCCESS:
      return {
        ...state,
        tip: formatTip(action.payload.tip)
      };
    case GET_TIP_FAIL:
      console.log('failed to get tip', action.payload.error);
      break;

    case SAVE_TIP_SUCCESS:
      // return {
      //   ...state,
      // };
      break;
    case SAVE_TIP_FAIL:
      console.log('failed to save tip', action.payload.error);
      break;

    case DELETE_TIP_SUCCESS:
      // return {
      //   ...state
      // };
      break;
    case DELETE_TIP_FAIL:
      console.log('failed to delete tip', action.payload.error);
      break;

    default:
      return state;
  }

  return state;
};

export function getTips(year, month) {
  return async (dispatch) => {
    try {
      const tips = await tipDao.getAllByMonth(year, month);
      return dispatch({
        type: GET_TIPS_SUCCESS,
        payload: {
          tips,
          year,
          month,
        }
      });
    } catch (error) {
      console.log('failed to get tips!', error);
      return dispatch({
        type: GET_TIPS_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

function initParams(params) {
  if (_.isNil(params)) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };
  }
  return params;
}

export function getMonthlyTips(params) {
  const { year: activeYear, month: activeMonth } = initParams(params);
  return async (dispatch) => {
    try {

      const tipSummaries = await tipDao.getMonthlyTotals();
      const tips = await tipDao.getAllByMonth(activeYear, activeMonth);
      return dispatch({
        type: GET_TIPS_SUMMARY_SUCCESS,
        payload: {
          tipSummaries,
          tips,
          year: activeYear,
          month: activeMonth,
        }
      });
    } catch (error) {
      console.log('failed to get tips!', error);
      return dispatch({
        type: GET_TIPS_SUMMARY_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export function saveTip(tip) {
  return async (dispatch) => {
    try {
      const savedTip = await tipDao.save(tip);
      await dispatch({
        type: SAVE_TIP_SUCCESS,
        payload: {
          tip: savedTip
        }
      });
      const { jobDate } = tip;
      return dispatch(getMonthlyTips({
        year: jobDate.getFullYear(),
        month: jobDate.getMonth() + 1,
      }));
    } catch (error) {
      return dispatch({
        type: SAVE_TIP_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export function deleteTip(tip) {
  return async (dispatch) => {
    try {
      await tipDao.delete(tip.id);
      await dispatch({
        type: DELETE_TIP_SUCCESS
      });
      const { jobDate } = tip;
      return dispatch(getMonthlyTips({
        year: jobDate.getFullYear(),
        month: jobDate.getMonth() + 1,
      }));
    } catch (error) {
      return dispatch({
        type: DELETE_TIP_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export default tipsReducer;
