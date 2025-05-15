import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { X, Calendar } from 'lucide-react';
import { useTask, Task } from '../context/TaskContext';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority);
  const [date, setDate] = useState(format(parseISO(task.date), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateTask } = useTask();

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await updateTask(task._id, {
        title,
        description,
        date: new Date(date).toISOString(),
        priority
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Edit Task</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="label">Task Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="label">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[80px]"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="date" className="label">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="label">Priority Level</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map((p) => (
                  <label 
                    key={p}
                    className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border ${
                      priority === p 
                        ? p === 'high' 
                          ? 'bg-red-50 border-red text-red' 
                          : p === 'medium' 
                            ? 'bg-orange-50 border-accent text-accent' 
                            : 'bg-green-50 border-green text-green'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={priority === p}
                      onChange={() => setPriority(p as 'low' | 'medium' | 'high')}
                      className="sr-only"
                    />
                    <span className="capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className={`btn btn-primary flex-1 ${(isSubmitting || !title.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;