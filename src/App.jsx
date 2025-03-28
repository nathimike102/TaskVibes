import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useSelector } from 'react-redux';
import LoginForm from './components/Auth/LoginForm';
import TaskInput from './components/Tasks/TaskInput';
import TaskList from './components/Tasks/TaskList';
import WeatherWidget from './components/Weather/WeatherWidget';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from './store/slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#282828] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Task Manager</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.username}</span>
              <button
                onClick={() => dispatch(logoutUser())}
                className="flex items-center space-x-2 text-gray-300 hover:text-[#1DB954] transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TaskInput />
            <TaskList />
          </div>
          <div>
            <WeatherWidget />
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const user = useSelector((state) => state.auth.currentUser);

  return (
    <div className="min-h-screen bg-[#121212]">
      {user ? <Dashboard /> : <LoginForm />}
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;