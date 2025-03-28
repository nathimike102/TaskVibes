import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/slices/weatherSlice';
import { Cloud, Loader, Search } from 'lucide-react';

const WeatherWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState([]);
  const { temperature, description, loading, error } = useSelector(
    (state) => state.weather
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm.length >= 3) {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=a821d0d23e394dfaba254358252803`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error('Error fetching cities:', err));
    } else {
      setCities([]);
    }
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    dispatch(fetchWeather(city.name));
    setSearchTerm(city.name);
    setCities([]);
  };

  if (loading) {
    return (
      <div className="spotify-card flex items-center justify-center p-4">
        <Loader className="h-5 w-5 animate-spin text-[#1DB954]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="spotify-card text-red-500 p-4">
        {error}
      </div>
    );
  }

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
            <div className="absolute w-full mt-1 bg-[#282828] rounded-md shadow-lg z-10">
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  className="w-full text-left px-4 py-2 hover:bg-[#383838] text-white"
                  onClick={() => handleCitySelect(city)}
                >
                  {city.name}, {city.country}
                </button>
              ))}
            </div>
          )}
        </div>
        {temperature && (
          <div className="flex items-center space-x-2">
            <Cloud className="h-6 w-6 text-[#1DB954]" />
            <div>
              <p className="text-lg font-medium text-white">{Math.round(temperature)}°C</p>
              <p className="text-sm text-gray-400 capitalize">{description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;