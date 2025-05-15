import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export interface Task {
  _id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksByDate {
  [date: string]: Task[];
}

interface TaskContextType {
  tasks: Task[];
  tasksByDate: TasksByDate;
  selectedDate: Date;
  loading: boolean;
  fetchTasks: (start?: Date, end?: Date) => Promise<void>;
  addTask: (task: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  getTasksForDate: (date: Date) => Task[];
  getHighestPriorityForDate: (date: Date) => 'low' | 'medium' | 'high' | 'completed' | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const organizeTasks = (tasks: Task[]) => {
    const organized: TasksByDate = {};
    
    tasks.forEach(task => {
      const dateKey = format(parseISO(task.date), 'yyyy-MM-dd');
      if (!organized[dateKey]) {
        organized[dateKey] = [];
      }
      organized[dateKey].push(task);
    });
    
    return organized;
  };

  const fetchTasks = async (start?: Date, end?: Date) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const startDate = start || startOfMonth(selectedDate);
      const endDate = end || endOfMonth(selectedDate);
      
      const response = await axios.get(
        `${API_URL}/tasks/range`, 
        { 
          ...getAuthHeaders(),
          params: {
            start: format(startDate, 'yyyy-MM-dd'),
            end: format(endDate, 'yyyy-MM-dd')
          }
        }
      );
      
      setTasks(response.data);
      setTasksByDate(organizeTasks(response.data));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post(
        `${API_URL}/tasks`,
        task,
        getAuthHeaders()
      );
      
      setTasks(prev => [...prev, response.data]);
      setTasksByDate(prev => {
        const dateKey = format(parseISO(response.data.date), 'yyyy-MM-dd');
        return {
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), response.data]
        };
      });
      
      toast.success('Task added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${id}`,
        updates,
        getAuthHeaders()
      );
      
      setTasks(prev => 
        prev.map(task => task._id === id ? response.data : task)
      );
      
      // Reorganize tasks by date if the date changed
      setTasksByDate(organizeTasks([
        ...tasks.filter(task => task._id !== id),
        response.data
      ]));
      
      toast.success('Task updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(
        `${API_URL}/tasks/${id}`,
        getAuthHeaders()
      );
      
      setTasks(prev => prev.filter(task => task._id !== id));
      
      // Remove task from tasksByDate
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasksByDate(organizeTasks(updatedTasks));
      
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/tasks/${id}/toggle`,
        {},
        getAuthHeaders()
      );
      
      setTasks(prev => 
        prev.map(task => task._id === id ? response.data : task)
      );
      
      // Update in tasksByDate
      setTasksByDate(prev => {
        const newTasksByDate = { ...prev };
        
        for (const dateKey in newTasksByDate) {
          newTasksByDate[dateKey] = newTasksByDate[dateKey].map(task => 
            task._id === id ? response.data : task
          );
        }
        
        return newTasksByDate;
      });
      
      const action = response.data.completed ? 'completed' : 'reopened';
      toast.success(`Task ${action} successfully`);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const getTasksForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  };

  const getHighestPriorityForDate = (date: Date) => {
    const tasksForDate = getTasksForDate(date);
    
    if (tasksForDate.length === 0) return null;
    
    // If all tasks are completed, return 'completed'
    if (tasksForDate.every(task => task.completed)) return 'completed';
    
    // Get incomplete tasks
    const incompleteTasks = tasksForDate.filter(task => !task.completed);
    
    if (incompleteTasks.length === 0) return 'completed';
    
    // Check for high priority
    if (incompleteTasks.some(task => task.priority === 'high')) return 'high';
    
    // Check for medium priority
    if (incompleteTasks.some(task => task.priority === 'medium')) return 'medium';
    
    // Otherwise, return low
    return 'low';
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const value = {
    tasks,
    tasksByDate,
    loading,
    selectedDate,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setSelectedDate,
    getTasksForDate,
    getHighestPriorityForDate
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};