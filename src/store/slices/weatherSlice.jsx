import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
);
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    return response.json();
  }
);

export const fetchWeatherByCoords = createAsyncThunk(
  'weather/fetchWeatherByCoords',
  async ({ lat, lon }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    return response.json();
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ lat, lon, date }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Forecast data fetch failed');
    }
    const data = await response.json();
    return { forecast: data, targetDate: date };
  }
);

const initialState = {
  temperature: 0,
  description: '',
  humidity: 0,
  windSpeed: 0,
  feelsLike: 0,
  loading: false,
  error: null,
  currentLocation: null,
  forecast: null,
  forecastDate: null,
};


const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    clearForecast: (state) => {
      state.forecast = null;
      state.forecastDate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.temperature = action.payload.main.temp;
        state.description = action.payload.weather[0].description;
        state.humidity = action.payload.main.humidity;
        state.windSpeed = action.payload.wind.speed;
        state.feelsLike = action.payload.main.feels_like;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.temperature = action.payload.main.temp;
        state.description = action.payload.weather[0].description;
        state.humidity = action.payload.main.humidity;
        state.windSpeed = action.payload.wind.speed;
        state.feelsLike = action.payload.main.feels_like;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload.forecast;
        state.forecastDate = action.payload.targetDate;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch forecast data';
      });
  },
});

export const { setCurrentLocation, clearForecast } = weatherSlice.actions;
export default weatherSlice.reducer;