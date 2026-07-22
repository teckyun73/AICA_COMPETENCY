import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import type { User, Candidate, Committee } from '../data/mockData';
import { AFFILIATES } from '../data/mockData';

interface MonthlyCalendarProps {
  currentUser: User;
  candidatesList: Candidate[];
  committeesList: Committee[];
  onSelectSchedule: (candidate: Candidate, targetView: 'admin' | 'reviewer' | 'evaluate' | 'report') => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  currentUser,
  candidatesList,
  committeesList,
  onSelectSchedule
}) => {
  // Default to July 2026 (matching mock data evaluation period)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 1-indexed (7 = July)
  const [filterLevel, setFilterLevel] = useState<'all' | '3' | '4'>('all');

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  // Helper to format YYYY-MM-DD
  const formatDateKey = (year: number, month: number, day: number) => {
    const m = month < 10 ? `0${month}` : `${month}`;
    const d = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${m}-${d}`;
  };

  // Calculate calendar days
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun, 1 = Mon ...

  const calendarDays = [];
  // Trailing days from previous month
  const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthLastDay - i,
      month: currentMonth === 1 ? 12 : currentMonth - 1,
      year: currentMonth === 1 ? currentYear - 1 : currentYear,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true
    });
  }

  // Leading days for next month to fill grid (multiple of 7)
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const remainingCells = totalCells - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      month: currentMonth === 12 ? 1 : currentMonth + 1,
      year: currentMonth === 12 ? currentYear + 1 : currentYear,
      isCurrentMonth: false
    });
  }

  const todayStr = '2026-07-22'; // Reference current simulation date

  return (
    <div className="card" style={{ marginBottom: '2rem', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-color)' }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex' }}>
            <CalendarIcon size={22} color="var(--accent-primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              AICA 자격심사 월별 일정 (Evaluation Calendar)
              <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-secondary)', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                {currentUser.role === 'admin' ? '운영간사 뷰' : '심사위원 뷰'}
              </span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
              심사일정을 클릭하면 해당 자격검정 평가 큐 또는 상세 종합판정서로 직접 이동합니다.
            </p>
          </div>
        </div>

        {/* Controls: Month Switcher & Level Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid var(--border-color)', padding: '0.15rem' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'transparent' }}
              onClick={handlePrevMonth}
              title="이전 달"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, padding: '0 0.6rem', color: 'var(--text-primary)' }}>
              {currentYear}년 {currentMonth}월
            </span>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'transparent' }}
              onClick={handleNextMonth}
              title="다음 달"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button 
            className="btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            onClick={handleToday}
          >
            오늘 (2026.07)
          </button>

          <select 
            value={filterLevel} 
            onChange={(e) => setFilterLevel(e.target.value as any)}
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
          >
            <option value="all">전체 레벨 (L3/L4)</option>
            <option value="3">AICA L3 심사만 보기</option>
            <option value="4">AICA L4 심사만 보기</option>
          </select>
        </div>
      </div>

      {/* Calendar Legend Badges */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(99, 102, 241, 0.6)', border: '1px solid #818cf8', display: 'inline-block' }}></span>
          <span>AICA L3 심사 (AI Champion)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(168, 85, 247, 0.6)', border: '1px solid #c084fc', display: 'inline-block' }}></span>
          <span>AICA L4 심사 (AI Specialist)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto' }}>
          <Sparkles size={13} color="var(--accent-secondary)" />
          <span>심사 일정 클릭 시 해당 평가 화면/보고서로 바로 연결됩니다.</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {/* Weekday Headers */}
        {['일', '월', '화', '수', '목', '금', '토'].map((wd, i) => (
          <div 
            key={wd} 
            style={{ 
              textAlign: 'center', 
              padding: '0.4rem', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '4px'
            }}
          >
            {wd}
          </div>
        ))}

        {/* Days */}
        {calendarDays.map((cell, idx) => {
          const dateStr = formatDateKey(cell.year, cell.month, cell.day);
          const isToday = dateStr === todayStr;

          // Filter candidates matching this date
          const matchingCandidates = candidatesList.filter(c => {
            if (!cell.isCurrentMonth) return false;
            if (!c.evalDate) return false;
            if (filterLevel !== 'all' && c.level !== parseInt(filterLevel)) return false;
            return c.evalDate === dateStr;
          });

          return (
            <div 
              key={idx}
              style={{
                minHeight: '90px',
                background: cell.isCurrentMonth 
                  ? (isToday ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)') 
                  : 'rgba(0, 0, 0, 0.25)',
                border: isToday 
                  ? '1px solid var(--accent-primary)' 
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                padding: '0.4rem',
                opacity: cell.isCurrentMonth ? 1 : 0.4,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Day Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: isToday ? 800 : 500,
                  color: isToday ? 'var(--accent-secondary)' : cell.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)'
                }}>
                  {cell.day}
                </span>
                {isToday && (
                  <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: 'white', padding: '0.05rem 0.35rem', borderRadius: '4px', fontWeight: 'bold' }}>
                    TODAY
                  </span>
                )}
              </div>

              {/* Assessment Event Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', maxHeight: '75px' }}>
                {matchingCandidates.map(cand => {
                  const comm = committeesList.find(co => co.candidateId === cand.id);
                  const isMyAssigned = currentUser.role === 'reviewer' && (
                    comm?.reviewer1Id === currentUser.id ||
                    comm?.reviewer2Id === currentUser.id ||
                    comm?.reviewer3Id === currentUser.id
                  );

                  const isLevel3 = cand.level === 3;
                  const bgGradient = isLevel3 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(79, 70, 229, 0.2))' 
                    : 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(147, 51, 234, 0.2))';
                  const borderColor = isLevel3 ? 'rgba(129, 140, 248, 0.5)' : 'rgba(192, 132, 252, 0.5)';
                  const textColor = isLevel3 ? '#c7d2fe' : '#e9d5ff';

                  return (
                    <div 
                      key={cand.id}
                      onClick={() => {
                        if (currentUser.role === 'admin') {
                          if (cand.status === '완료') {
                            onSelectSchedule(cand, 'report');
                          } else {
                            onSelectSchedule(cand, 'admin');
                          }
                        } else {
                          if (isMyAssigned) {
                            onSelectSchedule(cand, 'evaluate');
                          } else {
                            onSelectSchedule(cand, 'reviewer');
                          }
                        }
                      }}
                      style={{
                        background: bgGradient,
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        transition: 'transform 0.15s ease, filter 0.15s ease'
                      }}
                      title={`[클릭 시 이동] AICA Level ${cand.level} 심사 - ${cand.name} (${AFFILIATES.find(a => a.code === cand.affiliate)?.name || cand.affiliate}) - 상태: ${cand.status}`}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>AICA L{cand.level} 심사</span>
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: cand.status === '완료' ? '#4ade80' : cand.status === '평가중' ? '#fb923c' : '#94a3b8' 
                        }}></span>
                      </div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        👤 {cand.name} ({AFFILIATES.find(a => a.code === cand.affiliate)?.name || cand.affiliate})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
