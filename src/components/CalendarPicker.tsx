import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const CalendarPicker = ({ selectedDate, onDateSelect }: CalendarPickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };
  
  const isPastDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const isSelected = (day: number) => {
    return selectedDate === formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const handleDaySelect = (day: number) => {
    if (!isPastDate(day)) {
      onDateSelect(formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPastDate(day);
      const today = isToday(day);
      const selected = isSelected(day);
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: past ? 1 : 1.05 }}
          whileTap={{ scale: past ? 1 : 0.95 }}
          onClick={() => handleDaySelect(day)}
          disabled={past}
          className={`h-10 w-10 rounded-full text-sm font-body transition-all duration-200 ${
            past
              ? 'text-muted-foreground/30 cursor-not-allowed'
              : selected
              ? 'bg-primary text-primary-foreground'
              : today
              ? 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              : 'text-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {day}
        </motion.button>
      );
    }
    
    return days;
  };
  
  const monthYearString = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousMonth}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-display text-lg">{monthYearString}</h3>
        <button
          onClick={handleNextMonth}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-xs font-body text-muted-foreground">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      {/* Selected date display */}
      {selectedDate && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">Selected:</p>
          <p className="text-sm font-body">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
