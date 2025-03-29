import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/slices/weatherSlice';
import { Cloud, Loader, Search, MapPin, Wind, Droplets, ThermometerSun } from 'lucide-react';
import toast from 'react-hot-toast';

const WeatherWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [lastUpdate, setLastUpdate] = useState(null);
  const { temperature, description, humidity, windSpeed, feelsLike, loading, error } = useSelector(
    (state) => state.weather
  );
  const dispatch = useDispatch();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedSearchTerm.length >= 3) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedSearchTerm}&limit=5&appid=${API_KEY}`
            );
          if (!response.ok) throw new Error('Failed to fetch cities');
          const data = await response.json();
          setCities(data);
        } catch (err) {
          console.error('Error fetching cities:', err);
          setCities([]);
          toast.error('Failed to fetch cities');
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${API_KEY}`
            );
            const [city] = await response.json();
            if (city) {
              handleCitySelect(city);
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            toast.error('Failed to get current location');
          }
        },
        () => {
          toast.error('Location access denied');
        }
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdate && Date.now() - lastUpdate > 30 * 60 * 1000) {
        refreshWeather();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleCitySelect = async (city) => {
    try {
      await dispatch(fetchWeather(city.name)).unwrap();
      setSearchTerm(city.name);
      setCities([]);
      setLastUpdate(Date.now());
      toast.success(`Weather updated for ${city.name}`);
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error('Failed to fetch weather data');
    }
  };

  const refreshWeather = () => {
    if (searchTerm) {
      handleCitySelect({ name: searchTerm });
    }
  };

  const convertTemperature = (temp) => {
    return unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  };

  return (
    <div className="weather-card">
      <div className="flex flex-col space-y-6">
        <div className="relative">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city..."
              className="spotify-input w-full"
              aria-label="Search for a city"
            />
            <button
              onClick={refreshWeather}
              className="spotify-button p-3"
              aria-label="Refresh weather"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
          {cities.length > 0 && (
            <div className="absolute w-full mt-1 bg-[#282828] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  className="w-full text-left px-4 py-3 hover:bg-[#383838] text-white transition-colors duration-200"
                  onClick={() => handleCitySelect(city)}
                >
                  {city.name}, {city.country}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setUnit('celsius')}
            className={`px-3 py-1 rounded-full text-sm ${
              unit === 'celsius' ? 'bg-[#1DB954] text-white' : 'bg-[#282828] text-gray-400'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('fahrenheit')}
            className={`px-3 py-1 rounded-full text-sm ${
              unit === 'fahrenheit' ? 'bg-[#1DB954] text-white' : 'bg-[#282828] text-gray-400'
            }`}
          >
            °F
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-[#1DB954]" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center py-8">{error}</div>
        ) : temperature ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Cloud className="h-12 w-12 text-[#1DB954]" />
                <div>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(convertTemperature(temperature))}°
                    {unit === 'celsius' ? 'C' : 'F'}
                  </p>
                  <p className="text-lg text-gray-400 capitalize">{description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#282828] p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-[#1DB954]">
                  <ThermometerSun className="h-5 w-5" />
                  <span className="text-sm">Feels Like</span>
                </div>
                <p className="mt-2 text-lg font-medium">
                  {Math.round(convertTemperature(feelsLike))}°
                </p>
              </div>

              <div className="bg-[#282828] p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-[#1DB954]">
                  <Droplets className="h-5 w-5" />
                  <span className="text-sm">Humidity</span>
                </div>
                <p className="mt-2 text-lg font-medium">{humidity}%</p>
              </div>

              <div className="bg-[#282828] p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-[#1DB954]">
                  <Wind className="h-5 w-5" />
                  <span className="text-sm">Wind</span>
                </div>
                <p className="mt-2 text-lg font-medium">{windSpeed} m/s</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherWidget;