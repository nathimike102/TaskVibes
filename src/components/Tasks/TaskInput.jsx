import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskToFirebase } from '../../store/slices/tasksSlice';
import { Plus } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TaskInput = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date());
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.currentUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(
        addTaskToFirebase({
          title: title.trim(),
          priority,
          completed: false,
          dueDate: dueDate.toISOString(),
          createdAt: new Date().toISOString(),
          userId: user.id,
          comments: []
        })
      );
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="spotify-card">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="spotify-input flex-1 p-3"
        />
        <div className="flex gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="spotify-input p-3"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            className="spotify-input p-3"
            dateFormat="MMMM d, yyyy"
          />
          <button
            type="submit"
            className="spotify-button px-4"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskInput;