import React from 'react';
import { Card } from './Card';

interface SummarySectionProps {
  title: string;
  summary: string[];
  definitions: { [key:string]: string };
}

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);


export const SummarySection: React.FC<SummarySectionProps> = ({ title, summary, definitions }) => {
  return (
    <Card title={title} titleIcon={<FileTextIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-start">
        <div className="md:col-span-2 space-y-4 text-slate-700 min-w-0">
          {summary.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">{paragraph}</p>
          ))}
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">指標定義</h3>
            <ul className="space-y-3">
                {Object.entries(definitions).map(([key, value]) => (
                    <li key={key}>
                        <strong className="text-orange-600">{key}:</strong>
                        <p className="text-slate-500 text-sm">{value}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </Card>
  );
};