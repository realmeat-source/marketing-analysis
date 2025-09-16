
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleIcon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className, titleIcon }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 ${className}`}>
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {titleIcon}
            {title}
        </h2>
      </div>
      <div className="p-4 sm:p-6 text-slate-600">
        {children}
      </div>
    </div>
  );
};
