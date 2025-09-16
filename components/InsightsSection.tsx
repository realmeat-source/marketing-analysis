import React, { useMemo } from 'react';
import { InsightEntry, SuggestionEntry } from '../types';
import { Card } from './Card';

interface InsightsSectionProps {
  title: string;
  insights: InsightEntry[];
  suggestions: SuggestionEntry[];
}

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 9 5a6.5 6.5 0 0 0-4.5 10L2 17h10c0-1.7 1.3-3 3-3z" />
        <path d="M9 17v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1" />
    </svg>
);

interface CombinedEntry extends InsightEntry {
    suggestion: string;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ title, insights, suggestions }) => {
    
    const combinedData = useMemo((): CombinedEntry[] => {
        const suggestionMap = new Map<string | number, string>();
        suggestions.forEach(s => {
            if(s.gno) {
                suggestionMap.set(s.gno, s.suggestion);
            }
        });

        return insights.map(insight => {
            const suggestion = suggestionMap.get(insight.gno) || '無相關建議';
            return { ...insight, suggestion };
        });
    }, [insights, suggestions]);

    const displayTitle = title || "商品洞察與建議";

    if (!combinedData.length) {
        return null;
    }

    return (
        <Card title={displayTitle} titleIcon={<LightbulbIcon />}>
            <div className="space-y-4">
                {combinedData.map((item, index) => (
                    <div key={`${item.gno}-${index}`} className="p-4 bg-white rounded-lg border border-slate-200 transition-all hover:border-orange-300 hover:shadow-md">
                        <p className="font-semibold text-slate-800 truncate mb-3">{item.g_name}</p>
                        
                        <div>
                            <strong className="text-orange-500 block mb-1">投放建議:</strong>
                            <p className="text-slate-600">{item.suggestion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};