import React, { useState } from 'react';

const Calendar = () => {
    const [currentDate] = useState(new Date());
    const [currentMonth] = useState(new Date());

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' });
    };

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8" />);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= totalDays; day++) {
            const isToday =
                day === currentDate.getDate() &&
                currentMonth.getMonth() === currentDate.getMonth() &&
                currentMonth.getFullYear() === currentDate.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`h-8 flex items-center justify-center rounded-full
            ${isToday ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
            cursor-pointer transition-colors duration-200`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="w-full">
            <div className="mb-2 text-center text-gray-600 text-sm">
                {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs text-gray-500 py-0.5">
                        {day.slice(0, 1)}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {generateCalendarDays()}
            </div>
        </div>
    );
};

export default Calendar;