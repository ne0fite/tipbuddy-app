import _ from 'lodash';
import moment from 'moment';

import { formatTip, formatTipSummary } from './formatters';
import JobDAO from '../dao/JobDAO';
import TipDAO from '../dao/TipDAO';

const jobDao = new JobDAO();
const tipDao = new TipDAO();

export const GET_TIPS = 'tipkeeper-app/tips/GET_TIPS';
export const GET_TIPS_SUCCESS = 'tipkeeper-app/tips/GET_TIPS_SUCCESS';
export const GET_TIPS_FAIL = 'tipkeeper-app/tips/GET_TIPS_FAIL';

export const GET_TIP = 'tipkeeper-app/tips/GET_TIP';
export const GET_TIP_SUCCESS = 'tipkeeper-app/tips/GET_TIP_SUCCESS';
export const GET_TIP_FAIL = 'tipkeeper-app/tips/GET_TIP_FAIL';

export const UPDATE_TIP = 'tipkeeper-app/tips/UPDATE_TIP';
export const UPDATE_TIP_SUCCESS = 'tipkeeper-app/tips/UPDATE_TIP_SUCCESS';
export const UPDATE_TIP_FAIL = 'tipkeeper-app/tips/UPDATE_TIP_FAIL';

export const SAVE_TIP = 'tipkeeper-app/tips/SAVE_TIP';
export const SAVE_TIP_SUCCESS = 'tipkeeper-app/tips/SAVE_TIP_SUCCESS';
export const SAVE_TIP_FAIL = 'tipkeeper-app/tips/SAVE_TIP_FAIL';

export const DELETE_TIP = 'tipkeeper-app/tips/DELETE_TIP';
export const DELETE_TIP_SUCCESS = 'tipkeeper-app/tips/DELETE_TIP_SUCCESS';
export const DELETE_TIP_FAIL = 'tipkeeper-app/tips/DELETE_TIP_FAIL';

const initialState = {
  tips: [],
  tip: {}
};

function mapTipSummaries(tipSummaries, tips) {
  const formattedSummaries = _.map(tipSummaries, formatTipSummary);
  _.forEach(tips, (tip) => {
    const formatted = formatTip(tip);
    const monthString = moment(formatted.jobDate).utc().format('MMMM YYYY');
    const summary = _.find(formattedSummaries, { monthString });
    if (summary) {
      summary.tips.push(formatted);
    }
  });
  return formattedSummaries;
}

const tipsReducer = function tips(state = initialState, action) {
  switch (action.type) {
    case GET_TIPS_SUCCESS:
      return {
        ...state,
        tips: mapTipSummaries(action.payload.tipSummaries, action.payload.tips)
      };
    case GET_TIPS_FAIL:
      console.log('failed to get tips', action.payload.error);
      break;

    case GET_TIP_SUCCESS:
      return {
        ...state,
        tip: formatTip(action.payload.tip)
      };
    case GET_TIP_FAIL:
      console.log('failed to get tip', action.payload.error);
      break;

    case UPDATE_TIP_SUCCESS:
      return {
        ...state,
        tip: formatTip({
          ...state.tip,
          [action.payload.key]: action.payload.value
        })
      };
    case UPDATE_TIP_FAIL:
      console.log('failed to update tip', action.payload.error);
      break;

    case SAVE_TIP_SUCCESS:
      return {
        ...state,
        tip: action.payload.tip
      };
    case SAVE_TIP_FAIL:
      console.log('failed to save tip', action.payload.error);
      break;

    case DELETE_TIP_SUCCESS:
      return {
        ...state
      };
    case DELETE_TIP_FAIL:
      console.log('failed to delete tip', action.payload.error);
      break;

    default:
      return state;
  }

  return state;
};

export function getTips() {
  return async (dispatch) => {
    try {
      const tipSummaries = await tipDao.getMonthlyTotals();
      const tips = await tipDao.getAll();
      return dispatch({
        type: GET_TIPS_SUCCESS,
        payload: {
          tipSummaries,
          tips
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

async function makeEmptyTip() {
  const tip = {
    jobDate: new Date(),
    amount: 0.00,
    sales: 0.00,
    ccTips: 0.00,
    tipOut: 0.00,
  };

  const defaultJob = await jobDao.getDefault();
  if (defaultJob) {
    tip.jobId = defaultJob.id;
    tip.jobName = defaultJob.name;
    tip.job = defaultJob;
    tip.clockIn = defaultJob.clockIn;
    tip.clockOut = defaultJob.clockOut;
  }

  return tip;
}

async function loadTip(id) {
  if (!id) {
    // @TODO init tip from default job
    return makeEmptyTip();
  }
  return tipDao.getById(id);
}

export function getTip(id) {
  return async (dispatch) => {
    try {
      const tip = await loadTip(id);
      return dispatch({
        type: GET_TIP_SUCCESS,
        payload: {
          tip: formatTip(tip)
        }
      });
    } catch (error) {
      return dispatch({
        type: GET_TIP_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export function updateTip(key, value) {
  if (key === 'jobId') {
    return async (dispatch) => {
      const job = await jobDao.getById(value);
      if (!job) {
        return dispatch({
          type: UPDATE_TIP_FAIL,
          payload: {
            error: new Error('Invalid Job ID')
          }
        });
      }

      dispatch({
        type: UPDATE_TIP_SUCCESS,
        payload: {
          key: 'job',
          value: job
        }
      });
      dispatch({
        type: UPDATE_TIP_SUCCESS,
        payload: {
          key: 'clockIn',
          value: job.clockIn
        }
      });
      return dispatch({
        type: UPDATE_TIP_SUCCESS,
        payload: {
          key: 'clockOut',
          value: job.clockOut
        }
      });
    };
  }

  return {
    type: UPDATE_TIP_SUCCESS,
    payload: {
      key,
      value
    }
  };
}

export function saveTip() {
  return async (dispatch, getState) => {
    const state = getState();
    const { tip } = state.tips;
    try {
      const savedTip = await tipDao.save(tip);
      dispatch({
        type: SAVE_TIP_SUCCESS,
        payload: {
          tip: savedTip
        }
      });
      const tips = await tipDao.getMonthlyTotals();
      return dispatch({
        type: GET_TIPS_SUCCESS,
        payload: {
          tips
        }
      });
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

export function deleteTip() {
  return async (dispatch, getState) => {
    const state = getState();
    const { tip } = state.tips;
    try {
      await tipDao.delete(tip.id);
      dispatch({
        type: DELETE_TIP_SUCCESS
      });
      const tips = await tipDao.getMonthlyTotals();
      return dispatch({
        type: GET_TIPS_SUCCESS,
        payload: {
          tips
        }
      });
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
