import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice';
import { setCurrentLocation, fetchWeatherByCoords } from '../../store/slices/weatherSlice';
import { LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(loginUser({ email, password })).unwrap();
      } else {
        await dispatch(registerUser({ email, password, username })).unwrap();
      }
      
      // Get user's location after successful login/registration
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude: lat, longitude: lon } = position.coords;
            dispatch(setCurrentLocation({ lat, lon }));
            try {
              await dispatch(fetchWeatherByCoords({ lat, lon })).unwrap();
              toast.success('Weather data updated for your location');
            } catch (error) {
              toast.error('Failed to fetch weather for your location');
            }
          },
          (error) => {
            toast.error('Location access denied. Some features may be limited.');
          }
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold text-white">
            {isLogin ? 'Sign in to Task Manager' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  required
                  className="spotify-input w-full p-4"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div>
              <input
                type="email"
                required
                className="spotify-input w-full p-4"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="spotify-input w-full p-4"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="spotify-button w-full flex justify-center items-center disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#1DB954] hover:underline"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;