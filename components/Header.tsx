import React from 'react';
import { JsonInputSection } from './JsonInputSection';

interface HeaderProps {
    jsonInput: string;
    setJsonInput: (value: string) => void;
    handleUpdate: () => boolean;
    error: string | null;
    reportPeriod: string | null;
    sellerName: string | null;
}

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12.5C3 11.6716 3.67157 11 4.5 11H5.5C6.32843 11 7 11.6716 7 12.5V20.5C7 21.3284 6.32843 22 5.5 22H4.5C3.67157 22 3 21.3284 3 20.5V12.5ZM10 6.5C10 5.67157 10.6716 5 11.5 5H12.5C13.3284 5 14 5.67157 14 6.5V20.5C14 21.3284 13.3284 22 12.5 22H11.5C10.6716 22 10 21.3284 10 20.5V6.5ZM17 16.5C17 15.6716 17.6716 15 18.5 15H19.5C20.3284 15 21 15.6716 21 16.5V20.5C21 21.3284 20.3284 22 19.5 22H18.5C17.6716 22 17 21.3284 17 20.5V16.5Z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ jsonInput, setJsonInput, handleUpdate, error, reportPeriod, sellerName }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className='flex items-center gap-4'>
        <ChartBarIcon />
        <div>
            <h1 className="text-3xl font-bold text-slate-900">營銷分析助理－廣告分析</h1>
            <p className="text-slate-500 mt-1">Marketing Analysis Assistant - Ad Analysis</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
        {sellerName && (
            <div className="text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-2">
                <UserIcon />
                <span>報告對象: <strong className="font-semibold text-slate-800">{sellerName}</strong></span>
            </div>
        )}
        {reportPeriod && (
             <div className="text-sm text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                報告期間: {reportPeriod}
            </div>
        )}
        <JsonInputSection
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          handleUpdate={handleUpdate}
          error={error}
          reportPeriod={reportPeriod || ''}
          sellerName={sellerName || ''}
        />
      </div>
    </header>
  );
};