
import React from 'react';

interface AuthErrorProps {
  title: string;
  message: string;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);


export const AuthError: React.FC<AuthErrorProps> = ({ title, message }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-red-200 p-8 text-center mt-8 flex flex-col items-center justify-center min-h-[400px]">
      <LockIcon />
      <h2 className="mt-4 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600 max-w-md mx-auto">{message}</p>
      <p className="mt-6 text-sm text-slate-500">
        請上傳具有正確權限的有效數據文件，或聯繫客服尋求協助。
      </p>
    </div>
  );
};
