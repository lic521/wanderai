import React from 'react';
import { Plane } from 'lucide-react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Plane className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="text-lg font-medium text-gray-600 animate-pulse">正在为您规划完美旅程...</p>
    </div>
  );
};