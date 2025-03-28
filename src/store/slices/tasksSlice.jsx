import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId) => {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
);

export const addTaskToFirebase = createAsyncThunk(
  'tasks/addTask',
  async (task) => {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    return { id: docRef.id, ...task };
  }
);

export const updateTaskInFirebase = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }) => {
    await updateDoc(doc(db, 'tasks', id), updates);
    return { id, ...updates };
  }
);

export const deleteTaskFromFirebase = createAsyncThunk(
  'tasks/deleteTask',
  async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    return id;
  }
);

export const addCommentToTask = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, comment }) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      comments: comment
    });
    return { taskId, comment };
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reorderTasks: (state, action) => {
      const { source, destination, priority } = action.payload;
      const items = state.items.filter(task => task.priority === priority);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      state.items = [
        ...state.items.filter(task => task.priority !== priority),
        ...items
      ];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTaskToFirebase.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTaskInFirebase.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(deleteTaskFromFirebase.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      .addCase(addCommentToTask.fulfilled, (state, action) => {
        const task = state.items.find(task => task.id === action.payload.taskId);
        if (task) {
          task.comments = [...(task.comments || []), action.payload.comment];
        }
      });
  }
});

export const { reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;