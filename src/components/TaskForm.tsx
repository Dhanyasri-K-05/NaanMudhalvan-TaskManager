import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTask } from '../context/TaskContext';
import { Plus, Calendar } from 'lucide-react';

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { addTask, selectedDate } = useTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addTask({
        title,
        description,
        date: selectedDate.toISOString(),
        priority,
        completed: false
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)} 
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-600 hover:border-primary hover:text-primary transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task for {format(selectedDate, 'MMM d')}</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="label">Task Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
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
              placeholder="Add details about this task"
              className="input min-h-[80px]"
              rows={3}
            />
          </div>
          
          <div>
            <label className="label">Priority Level</label>
            <div className="flex gap-4">
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
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Scheduled for {format(selectedDate, 'MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className={`btn btn-primary flex-1 ${(isSubmitting || !title.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;