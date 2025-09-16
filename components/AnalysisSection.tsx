
import React, { useState } from 'react';
import { Card } from './Card';
import { DataBlock } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AnalysisSectionProps {
  title: string;
  userAnalysis: string;
  setUserAnalysis: (value: string) => void;
  rawData: DataBlock[];
}

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
    </svg>
);


export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, userAnalysis, setUserAnalysis, rawData }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setApiError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable not set.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
您是一位專業的電子商務廣告數據分析師。請根據以下 JSON 格式的廣告成效數據和我的筆記，生成一份精簡、專業的分析報告。

報告重點：
1.  總結關鍵發現。
2.  提出具體、可行的優化建議。
3.  預測未來7天的策略方向。

請以點列式呈現，內容要切中要點，並保持專業的語氣。

**JSON 數據:**
\`\`\`json
${JSON.stringify(rawData, null, 2)}
\`\`\`

**我的筆記:**
${userAnalysis || '無'}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setUserAnalysis(response.text);
            setIsSubmitted(true);

        } catch (error: any) {
            console.error("Gemini API call failed:", error);
            const errorMessage = error.message?.includes('API key not valid') 
                ? 'API 金鑰無效，請檢查設定。'
                : '無法生成報告，請稍後再試。';
            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card title={title} titleIcon={<EditIcon />}>
            {isSubmitted ? (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">AI 生成的分析報告</h3>
                    <div className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-lg border border-slate-200 whitespace-pre-wrap">
                        {userAnalysis}
                    </div>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                    >
                        編輯或重新生成
                    </button>
                </div>

            ) : (
                <div>
                    <p className="mb-4 text-slate-500">在這裡輸入您的觀察與結論，AI 將結合儀表板數據為您生成一份完整的分析報告。</p>
                    <textarea
                        value={userAnalysis}
                        onChange={(e) => setUserAnalysis(e.target.value)}
                        placeholder="例如：賣場廣告 ROAS 表現突出，但注目商品成效不佳，應考慮調整預算..."
                        className="w-full h-40 p-3 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none transition-shadow"
                    />
                    <div className="mt-4 flex flex-col items-start">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    生成中...
                                </>
                            ) : (
                                '使用 AI 生成報告'
                            )}
                        </button>
                        {apiError && <p className="text-red-600 mt-2 font-semibold text-sm">{apiError}</p>}
                    </div>
                </div>
            )}
        </Card>
    );
};
