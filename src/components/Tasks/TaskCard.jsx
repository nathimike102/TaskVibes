import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Trash2, CheckCircle, MessageSquare, Edit2 } from 'lucide-react';

const TaskCard = ({ task, onToggle, onDelete, onEdit, onAddComment, comment, setComment }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`spotify-card ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggle}
              className={`text-gray-400 hover:text-[#1DB954] transition-colors ${
                task.completed ? 'text-[#1DB954]' : ''
              }`}
            >
              <CheckCircle className="h-5 w-5"                 
              style={{ color: task.completed ? '#1DB954' : 'inherit' }}
              />
            </button>
            <span
              className={`text-lg ${
                task.completed ? 'line-through text-gray-500' : 'text-white'
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-[#1DB954] transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
        </div>
        <div className="mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="spotify-input text-sm p-2 flex-1"
            />
            <button
              onClick={() => onAddComment(task.id)}
              className="text-gray-400 hover:text-[#1DB954] transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
          {task.comments && task.comments.length > 0 && (
            <div className="mt-2 space-y-2">
              {task.comments.map((comment, index) => (
                <div key={index} className="text-sm text-gray-400 bg-[#282828] p-2 rounded">
                  <div className="font-medium text-white">{comment.username}</div>
                  <div>{comment.text}</div>
                  <div className="text-xs">{format(new Date(comment.timestamp), 'MMM d, yyyy HH:mm')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;