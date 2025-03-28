import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a821d0d23e394dfaba254358252803`
    );
    if (!response.ok) throw new Error('Weather data fetch failed');
    return response.json();
  }
);

const initialState = {
  temperature: 0,
  description: '',
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
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
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export default weatherSlice.reducer;