import React from 'react';
import { useTask, Task } from '../context/TaskContext';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import TaskEditModal from './TaskEditModal';

interface TaskListProps {
  date: Date;
}

const TaskList: React.FC<TaskListProps> = ({ date }) => {
  const { getTasksForDate, toggleTaskCompletion, deleteTask } = useTask();
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  
  const tasks = getTasksForDate(date);

  const handleToggle = (id: string) => {
    toggleTaskCompletion(id);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No tasks scheduled for this day.</p>
        <p className="text-gray-400 text-sm mt-1">Add a task using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`card card-hover border-l-4 ${
            task.completed 
              ? 'border-green' 
              : task.priority === 'high' 
                ? 'border-red' 
                : task.priority === 'medium' 
                  ? 'border-accent' 
                  : 'border-green'
          } ${task.completed ? 'bg-gray-50' : ''}`}
        >
          <div className="flex items-start gap-3">
            <button 
              onClick={() => handleToggle(task._id)}
              className="mt-1 flex-shrink-0 transition-all duration-200"
            >
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-primary" />
              )}
            </button>
            
            <div className="flex-grow">
              <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
              
              <div className="mt-2 flex items-center text-xs text-gray-500 gap-2">
                <span className={`px-2 py-1 rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-50 text-red' 
                    : task.priority === 'medium' 
                      ? 'bg-orange-50 text-accent' 
                      : 'bg-green-50 text-green'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                
                <span className="text-gray-400">
                  {format(parseISO(task.date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleEdit(task)}
                className="p-1 text-gray-400 hover:text-primary transition-colors"
                aria-label="Edit task"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => handleDelete(task._id)}
                className="p-1 text-gray-400 hover:text-red transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {editingTask && (
        <TaskEditModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}
    </div>
  );
};

export default TaskList;