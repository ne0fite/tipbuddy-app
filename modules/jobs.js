import _ from 'lodash';

import { formatJob } from './formatters';
import JobDAO from '../dao/JobDAO';

const jobDao = new JobDAO();

export const GET_JOBS = 'tipkeeper-app/jobs/GET_JOBS';
export const GET_JOBS_SUCCESS = 'tipkeeper-app/jobs/GET_JOBS_SUCCESS';
export const GET_JOBS_FAIL = 'tipkeeper-app/jobs/GET_JOBS_FAIL';

export const GET_JOB = 'tipkeeper-app/jobs/GET_JOB';
export const GET_JOB_SUCCESS = 'tipkeeper-app/jobs/GET_JOB_SUCCESS';
export const GET_JOB_FAIL = 'tipkeeper-app/jobs/GET_JOB_FAIL';

export const UPDATE_JOB = 'tipkeeper-app/jobs/UPDATE_JOB';
export const UPDATE_JOB_SUCCESS = 'tipkeeper-app/jobs/UPDATE_JOB_SUCCESS';
export const UPDATE_JOB_FAIL = 'tipkeeper-app/jobs/UPDATE_JOB_FAIL';

export const SAVE_JOB = 'tipkeeper-app/jobs/SAVE_JOB';
export const SAVE_JOB_SUCCESS = 'tipkeeper-app/jobs/SAVE_JOB_SUCCESS';
export const SAVE_JOB_FAIL = 'tipkeeper-app/jobs/SAVE_JOB_FAIL';

export const DELETE_JOB = 'tipkeeper-app/jobs/DELETE_JOB';
export const DELETE_JOB_SUCCESS = 'tipkeeper-app/jobs/DELETE_JOB_SUCCESS';
export const DELETE_JOB_FAIL = 'tipkeeper-app/jobs/DELETE_JOB_FAIL';

const emptyJob = {
  name: '',
  rate: 0.00,
  clockIn: '08:00',
  clockOut: '17:00',
  defaultJob: false
};

const initialState = {
  jobs: [],
  job: emptyJob
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

    case UPDATE_JOB:
      return {
        ...state,
        job: formatJob({
          ...state.job,
          [action.payload.key]: action.payload.value
        })
      };

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

export function updateJob(key, value) {
  return {
    type: UPDATE_JOB,
    payload: {
      key,
      value
    }
  };
}

export function saveJob() {
  return async (dispatch, getState) => {
    const state = getState();
    const { job } = state.jobs;
    try {
      const savedJob = await jobDao.save(job);
      dispatch({
        type: SAVE_JOB_SUCCESS,
        payload: {
          job: savedJob
        }
      });
      const jobs = await jobDao.getAll();
      return dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs
        }
      });
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

export function deleteJob() {
  return async (dispatch, getState) => {
    const state = getState();
    const { job } = state.jobs;
    try {
      await jobDao.delete(job.id);
      dispatch({
        type: DELETE_JOB_SUCCESS
      });
      const jobs = await jobDao.getAll();
      return dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs
        }
      });
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
