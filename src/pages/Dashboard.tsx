import React, { useEffect } from 'react';
import Calendar from '../components/Calendar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useTask } from '../context/TaskContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { selectedDate, fetchTasks, loading } = useTask();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Your Task Dashboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Calendar
            </h2>
            <Calendar />
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <p className="text-gray-500 mb-6">Manage your tasks for this day</p>
            
            <TaskForm />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tasks for {format(selectedDate, 'MMMM d')}
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <TaskList date={selectedDate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;