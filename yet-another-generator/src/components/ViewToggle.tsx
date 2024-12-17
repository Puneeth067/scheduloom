import React from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { ViewMode } from '../types';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'student'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setViewMode('student')}
      >
        <GraduationCap className="w-5 h-5" />
        Student View
      </button>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          viewMode === 'teacher'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setViewMode('teacher')}
      >
        <Users className="w-5 h-5" />
        Teacher View
      </button>
    </div>
  );
}