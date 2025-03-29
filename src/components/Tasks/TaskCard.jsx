import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, differenceInDays } from 'date-fns';
import { Trash2, CheckCircle, MessageSquare, Edit2, Cloud } from 'lucide-react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForecast } from '../../store/slices/weatherSlice';

Modal.setAppElement('#root');

const TaskCard = ({ task, onToggle, onDelete, onEdit, onAddComment, comment, setComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const editInputRef = useRef(null);
  const dispatch = useDispatch();
  const { currentLocation, forecast, forecastDate, loading: weatherLoading } = useSelector((state) => state.weather);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (showWeather && currentLocation && task.dueDate) {
      const daysUntilTask = differenceInDays(new Date(task.dueDate), new Date());
      if (daysUntilTask <= 7) {
        dispatch(fetchForecast({
          lat: currentLocation.lat,
          lon: currentLocation.lon,
          date: task.dueDate
        }));
      }
    }
  }, [showWeather, currentLocation, task.dueDate]);

  const handleEditStart = () => {
    setIsEditing(true);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleEditSave = async () => {
    if (editedTitle.trim() !== task.title) {
      try {
        await onEdit({ ...task, title: editedTitle.trim() });
        toast.success('Task updated successfully');
      } catch (error) {
        toast.error('Failed to update task');
        setEditedTitle(task.title);
      }
    }
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
    setShowDeleteModal(false);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        await onAddComment(task.id);
        toast.success('Comment added successfully');
      } catch (error) {
        toast.error('Failed to add comment');
      }
    }
  };

  const renderWeatherForecast = () => {
    const daysUntilTask = differenceInDays(new Date(task.dueDate), new Date());
    
    if (daysUntilTask > 7) {
      return (
        <div className="text-yellow-500 text-sm mt-2">
          Weather forecast unavailable for dates beyond 7 days. Consider checking weather conditions closer to the task date.
        </div>
      );
    }

    if (weatherLoading) {
      return <div className="text-gray-400 text-sm mt-2">Loading weather forecast...</div>;
    }

    if (forecast && forecastDate === task.dueDate) {
      const dayForecast = forecast.list.find(f => {
        const forecastDate = new Date(f.dt * 1000);
        return format(forecastDate, 'yyyy-MM-dd') === format(new Date(task.dueDate), 'yyyy-MM-dd');
      });

      if (dayForecast) {
        return (
          <div className="bg-[#282828] p-3 rounded-lg mt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {Math.round(dayForecast.main.temp)}°C
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {dayForecast.weather[0].description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Precipitation: {Math.round(dayForecast.pop * 100)}%
                </p>
                <p className="text-xs text-gray-400">
                  Humidity: {dayForecast.main.humidity}%
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`spotify-card ${task.completed ? 'opacity-60' : ''} transform transition-all duration-200 hover:scale-[1.02]`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={onToggle}
                className={`touch-target p-2 text-gray-400 hover:text-[#1DB954] transition-colors ${
                  task.completed ? 'text-[#1DB954]' : ''
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
              <CheckCircle className="h-5 w-5"                 
                style={{ color: task.completed ? '#1DB954' : 'inherit' }}
              />
              </button>
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="spotify-input flex-1"
                  onBlur={handleEditSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                />
              ) : (
                <span
                  className={`text-lg ${
                    task.completed ? 'line-through text-gray-500' : 'text-white'
                  }`}
                >
                  {task.title}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowWeather(!showWeather)}
                className="touch-target p-2 text-gray-400 hover:text-[#1DB954] transition-colors"
                aria-label="Show weather forecast"
              >
                <Cloud className="h-4 w-4" />
              </button>
              <button
                onClick={handleEditStart}
                className="touch-target p-2 text-gray-400 hover:text-[#1DB954] transition-colors"
                aria-label="Edit task"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="touch-target p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </div>

          {showWeather && renderWeatherForecast()}

          <div className="mt-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-gray-400 hover:text-[#1DB954] transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{task.comments?.length || 0} comments</span>
            </button>

            {showComments && (
              <div className="mt-4 space-y-4 animate-slide-in">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="spotify-input text-sm p-2 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="spotify-button px-4"
                    aria-label="Add comment"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>

                {task.comments && task.comments.length > 0 && (
                  <div className="space-y-2">
                    {task.comments.map((comment, index) => (
                      <div key={index} className="text-sm bg-[#282828] p-3 rounded animate-fade-in">
                        <div className="font-medium text-white">{comment.username}</div>
                        <div className="mt-1">{comment.text}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {format(new Date(comment.timestamp), 'MMM d, yyyy HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Delete Task</h3>
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="spotify-button bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="spotify-button bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;