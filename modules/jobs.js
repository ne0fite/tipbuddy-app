import _ from 'lodash';

import { formatJob } from './formatters';
import DAO from '../dao/DAO';
import { getMonthlyTips } from './tips';

const jobDao = DAO.get(DAO.JOB);

export const GET_JOBS = 'tipstash-app/jobs/GET_JOBS';
export const GET_JOBS_SUCCESS = 'tipstash-app/jobs/GET_JOBS_SUCCESS';
export const GET_JOBS_FAIL = 'tipstash-app/jobs/GET_JOBS_FAIL';

export const GET_JOB = 'tipstash-app/jobs/GET_JOB';
export const GET_JOB_SUCCESS = 'tipstash-app/jobs/GET_JOB_SUCCESS';
export const GET_JOB_FAIL = 'tipstash-app/jobs/GET_JOB_FAIL';

export const SAVE_JOB = 'tipstash-app/jobs/SAVE_JOB';
export const SAVE_JOB_SUCCESS = 'tipstash-app/jobs/SAVE_JOB_SUCCESS';
export const SAVE_JOB_FAIL = 'tipstash-app/jobs/SAVE_JOB_FAIL';

export const DELETE_JOB = 'tipstash-app/jobs/DELETE_JOB';
export const DELETE_JOB_SUCCESS = 'tipstash-app/jobs/DELETE_JOB_SUCCESS';
export const DELETE_JOB_FAIL = 'tipstash-app/jobs/DELETE_JOB_FAIL';

const emptyJob = {
  name: '',
  rate: 0.00,
  clockIn: '08:00',
  clockOut: '17:00',
  defaultJob: false
};

const initialState = {
  jobs: [],
};

const jobsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_JOBS_SUCCESS:
      return {
        ...state,
        jobs: _.map(action.payload.jobs, formatJob)
      };
    case GET_JOBS_FAIL:
      console.log('failed to get jobs', action.payload.error);
      break;

    case GET_JOB_SUCCESS:
      return {
        ...state,
        job: formatJob(action.payload.job)
      };
    case GET_JOB_FAIL:
      console.log('failed to get job', action.payload.error);
      break;

    case SAVE_JOB_SUCCESS:
      return {
        ...state,
        job: action.payload.job
      };
    case SAVE_JOB_FAIL:
      console.log('failed to save job', action.payload.error);
      break;

    case DELETE_JOB_SUCCESS:
      return {
        ...state
      };
    case DELETE_JOB_FAIL:
      console.log('failed to delete job', action.payload.error);
      break;

    default:
      return state;
  }

  return state;
};

export function getJobs() {
  return async (dispatch) => {
    try {
      const jobs = await jobDao.getAll();
      return dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs
        }
      });
    } catch (error) {
      console.log('failed to get jobs!', error);
      return dispatch({
        type: GET_JOBS_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

async function loadJob(id) {
  if (!id) {
    return emptyJob;
  }
  return jobDao.getById(id);
}

export function getJob(id) {
  return async (dispatch) => {
    try {
      const job = await loadJob(id);
      return dispatch({
        type: GET_JOB_SUCCESS,
        payload: {
          job
        }
      });
    } catch (error) {
      return dispatch({
        type: GET_JOB_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export function saveJob(job) {
  return async (dispatch) => {
    try {
      const savedJob = await jobDao.save(job);
      await dispatch({
        type: SAVE_JOB_SUCCESS,
        payload: {
          job: savedJob
        }
      });
      await dispatch(getJobs());
      return dispatch(getMonthlyTips());
    } catch (error) {
      return dispatch({
        type: SAVE_JOB_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export function deleteJob(job) {
  return async (dispatch) => {
    try {
      await jobDao.delete(job.id);
      await dispatch({
        type: DELETE_JOB_SUCCESS
      });
      await dispatch(getJobs());
      return dispatch(getMonthlyTips());
    } catch (error) {
      return dispatch({
        type: DELETE_JOB_FAIL,
        payload: {
          error
        }
      });
    }
  };
}

export default jobsReducer;
