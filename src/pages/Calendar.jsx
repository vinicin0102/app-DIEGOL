import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar as CalendarIcon } from 'lucide-react';
import './Calendar.css';

const Calendar = () => {
    const { calendarData } = useGame();
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const resetToToday = () => setCurrentDate(new Date());

    const days = [];
    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const data = calendarData[dateStr] || { completed: false, count: '0/5' };
        const isToday = dateStr === todayStr;

        days.push(
            <div key={d} className={`calendar-day-card ${data.completed ? 'completed' : ''} ${isToday ? 'today' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="calendar-day-number" style={{ color: isToday ? '#00DDEE' : '#fff' }}>{d}</span>
                    <span className="calendar-day-progress">{data.count}</span>
                </div>

                <div>
                    <div className="day-progress-mini">
                        <div
                            className="day-progress-mini-fill"
                            style={{
                                width: data.completed ? '100%' : `${(parseInt(data.count.split('/')[0]) / parseInt(data.count.split('/')[1])) * 100}%`,
                                background: data.completed ? 'var(--primary)' : '#444'
                            }}
                        ></div>
                    </div>
                    <div className="day-dots-container">
                        <div className="day-dot-mini" style={{ background: '#00FF88' }}></div>
                        <div className="day-dot-mini" style={{ background: '#7B2FFF' }}></div>
                        <div className="day-dot-mini" style={{ background: '#FF3366' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="calendar-page page-enter">
            {/* View Mode Tabs */}
            <div className="calendar-tab-group">
                <button className="calendar-tab">Dia</button>
                <button className="calendar-tab">Semana</button>
                <button className="calendar-tab active">Mês</button>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>
                    {months[month]} {year}
                </h2>
            </div>

            {/* Controls */}
            <div className="glass-panel" style={{ padding: '8px', marginBottom: '32px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', width: 'fit-content', margin: '0 auto 32px' }}>
                <button onClick={resetToToday} style={{ background: 'none', border: 'none', color: '#00DDEE', cursor: 'pointer' }}>
                    <RotateCcw size={18} />
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ChevronLeft size={20} />
                </button>
                <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <CalendarIcon size={18} />
                </button>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
                {daysOfWeek.map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {days}
            </div>
        </div>
    );
};

export default Calendar;
