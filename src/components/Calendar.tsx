import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  getDay 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { selectedDate, setSelectedDate, getHighestPriorityForDate } = useTask();

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-medium text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, i) => (
          <div
            key={i}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    
    const endDate = new Date(monthEnd);
    // Ensure we have enough rows by adding days
    endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd)) + (getDay(monthStart) === 0 ? 0 : 7));
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Organize dates into weeks
    const weeks = [];
    let week = [];

    for (let i = 0; i < dateRange.length; i++) {
      week.push(dateRange[i]);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    return (
      <div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day, dayIndex) => {
              const priority = getHighestPriorityForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div key={dayIndex} className="relative">
                  <button
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'text-gray-300' : ''}`}
                    onClick={() => onDateClick(day)}
                  >
                    {format(day, 'd')}
                  </button>
                  
                  {priority && isCurrentMonth && (
                    <div className={`calendar-day-dot dot-${priority}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="select-none">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;