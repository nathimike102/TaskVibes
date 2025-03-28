import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import authReducer from './slices/authSlice';
import weatherReducer from './slices/weatherSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    weather: weatherReducer,
  },
});

export default store;