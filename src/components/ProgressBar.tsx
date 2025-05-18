
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'bg-ai-purple', 
  label 
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600 font-medium">{label}</span>
          <span className="font-semibold">{progress}%</span>
        </div>
      )}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
