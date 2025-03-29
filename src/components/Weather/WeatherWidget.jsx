import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/slices/weatherSlice';
import { Cloud, Loader, Search } from 'lucide-react';

const WeatherWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { temperature, description, loading, error } = useSelector(
    (state) => state.weather
  );
  const dispatch = useDispatch();

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
            `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedSearchTerm}&limit=5&appid=a821d0d23e394dfaba254358252803`
          );
          if (!response.ok) throw new Error('Failed to fetch cities');
          const data = await response.json();
          setCities(data);
        } catch (err) {
          console.error('Error fetching cities:', err);
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [debouncedSearchTerm]);

  const handleCitySelect = async (city) => {
    try {
      await dispatch(fetchWeather(city.name)).unwrap();
      setSearchTerm(city.name);
      setCities([]);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <div className="spotify-card">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city..."
              className="spotify-input w-full p-2"
            />
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          {cities.length > 0 && (
            <div className="absolute w-full mt-1 bg-[#282828] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  className="w-full text-left px-4 py-2 hover:bg-[#383838] text-white transition-colors duration-200"
                  onClick={() => handleCitySelect(city)}
                >
                  {city.name}, {city.country}
                </button>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader className="h-6 w-6 animate-spin text-[#1DB954]" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center">{error}</div>
        ) : temperature ? (
          <div className="flex items-center space-x-2">
            <Cloud className="h-6 w-6 text-[#1DB954]" />
            <div>
              <p className="text-lg font-medium text-white">{Math.round(temperature)}°C</p>
              <p className="text-sm text-gray-400 capitalize">{description}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherWidget;