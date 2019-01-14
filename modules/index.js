import { combineReducers } from 'redux';

import jobsReducer from './jobs';
import tipsReducer from './tips';

const appReducer = combineReducers({
  jobs: jobsReducer,
  tips: tipsReducer,
});

export default appReducer;
