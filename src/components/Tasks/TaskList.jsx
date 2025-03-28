import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, updateTaskInFirebase, deleteTaskFromFirebase, reorderTasks, addCommentToTask } from '../../store/slices/tasksSlice';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2, CheckCircle, MessageSquare, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import TaskCard from './TaskCard';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const activeTask = tasks.find(task => task.id === active.id);
      dispatch(reorderTasks({
        source: { index: tasks.indexOf(activeTask) },
        destination: { index: tasks.findIndex(task => task.id === over.id) },
        priority: activeTask.priority
      }));
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = [];
    }
    acc[task.priority].push(task);
    return acc;
  }, {});

  Object.keys(groupedTasks).forEach(priority => {
    groupedTasks[priority].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  });

  const handleAddComment = (taskId) => {
    if (comment.trim()) {
      dispatch(addCommentToTask({
        taskId,
        comment: {
          text: comment,
          userId: user.id,
          username: user.username,
          timestamp: new Date().toISOString()
        }
      }));
      setComment('');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {['high', 'medium', 'low'].map(priority => (
        <div key={priority} className="spotify-card">
          <h3 className="text-xl font-bold text-white capitalize mb-4">
            {priority} Priority
          </h3>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={groupedTasks[priority]?.map(task => task.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {groupedTasks[priority]?.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => dispatch(updateTaskInFirebase({
                      id: task.id,
                      updates: { completed: !task.completed }
                    }))}
                    onDelete={() => dispatch(deleteTaskFromFirebase(task.id))}
                    onEdit={setEditingTask}
                    onAddComment={handleAddComment}
                    comment={comment}
                    setComment={setComment}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  );
};

export default TaskList;