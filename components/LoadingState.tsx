
import React from 'react';

interface LoadingStateProps {
  title: string;
  message: string;
}

const LoadingSpinner = () => (
  <svg className="animate-spin h-12 w-12 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const LoadingState: React.FC<LoadingStateProps> = ({ title, message }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-slate-200 p-8 text-center mt-8 flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner />
      <h2 className="mt-6 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600 max-w-md mx-auto">{message}</p>
    </div>
  );
};
