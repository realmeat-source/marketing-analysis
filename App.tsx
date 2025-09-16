import React, { useState, useMemo, useEffect } from 'react';
import { DataBlock, PerformanceEntry, InsightEntry, SuggestionEntry, ChartDefinition, StandardDataBlock, ErrorBlock, LoadingBlock } from './types';
import { Header } from './components/Header';
import { SummarySection } from './components/SummarySection';
import { ChartsDashboard } from './components/ChartsDashboard';
import { PerformanceTable } from './components/PerformanceTable';
import { InsightsSection } from './components/InsightsSection';
import { AuthError } from './components/AuthError';
import { LoadingState } from './components/LoadingState';

const App: React.FC = () => {
  // State for dynamic data
  const [rawData, setRawData] = useState<DataBlock[]>([
    {
      "type": "get_data" as const,
      "title": "資料分析中",
      "message": "正在取得分析資料"
    }
  ]);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Centralized report metadata, now managed by state
  const [reportPeriod, setReportPeriod] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const seller = params.get('seller');
            const date = params.get('date');

            if (!seller || !date) {
                setRawData([{
                    type: 'error_message',
                    title: '缺少參數',
                    error_code: 'NO_AUTH',
                    message: 'URL 中缺少必要的 seller 或 date 參數以載入報告。'
                }]);
                return;
            }
            
            const response = await fetch(`https://rtapi.ruten.com.tw/api/ai/v1/market_analy?seller=${seller}&date=${date}`);
            if (!response.ok) {
                throw new Error(`伺服器錯誤: ${response.status}`);
            }

            const result = await response.json();

            setSellerName(result.metadata.seller);
            setReportPeriod(result.metadata.reportPeriod);

            if (result.data && Array.isArray(result.data) && result.data.length > 0 && result.data[0]?.type === 'pending') {
                setRawData(result.data);
                setTimeout(fetchData, 5000);
            } else {
                setRawData(result.data);
                setJsonInput(JSON.stringify(result, null, 2));
            }

        } catch (error: any) {
            console.error("資料載入失敗:", error);
            setRawData([{
                type: 'error_message',
                title: '資料載入失敗',
                error_code: 'NO_AUTH',
                message: `無法載入分析報告。請檢查您的網路連線或稍後再試。 (${error.message})`
            }]);
        }
    };

    fetchData();
  }, []);

  const {
    performanceData,
    performanceBlockTitle,
    insightData,
    insightBlockTitle,
    suggestionData,
    chartData,
    chartBlockTitle,
    definitions,
    summaryInsights,
    summarySuggestions,
    summaryCharts,
    authError,
    loadingState
  } = useMemo(() => {
    const errorBlock = rawData.find(
        (d): d is ErrorBlock => d.type === 'error_message' && 'error_code' in d && (d as ErrorBlock).error_code === 'NO_AUTH'
    );

    const loadingBlock = rawData.find(
        (d): d is LoadingBlock => d.type === 'get_data' || d.type === 'pending'
    );

    if (errorBlock) {
        return {
            performanceData: [],
            performanceBlockTitle: '',
            insightData: [],
            insightBlockTitle: '',
            suggestionData: [],
            chartData: [],
            chartBlockTitle: '',
            definitions: {},
            summaryInsights: [],
            summarySuggestions: [],
            summaryCharts: [],
            authError: { title: errorBlock.title, message: errorBlock.message },
            loadingState: null,
        };
    }

    if (loadingBlock) {
        return {
            performanceData: [],
            performanceBlockTitle: '',
            insightData: [],
            insightBlockTitle: '',
            suggestionData: [],
            chartData: [],
            chartBlockTitle: '',
            definitions: {},
            summaryInsights: [],
            summarySuggestions: [],
            summaryCharts: [],
            authError: null,
            loadingState: { title: loadingBlock.title, message: loadingBlock.message },
        };
    }

    // A more robust way of finding data blocks
    const performanceBlock = rawData.find(d => d.type === 'data_array' && d.title.includes("成效總覽")) as StandardDataBlock | undefined;
    const insightsBlock = rawData.find(d => d.type === 'data_array' && !d.title.includes("成效總覽")) as StandardDataBlock | undefined;
    const suggestionsBlock = rawData.find(d => d.type === 'suggestion') as StandardDataBlock | undefined;
    const chartsBlock = rawData.find(d => d.type === 'chart') as StandardDataBlock | undefined;

    return {
      performanceData: (performanceBlock?.data as PerformanceEntry[] || []),
      performanceBlockTitle: performanceBlock?.title || "商品 × 廣告類型成效總覽",
      insightData: (insightsBlock?.data as InsightEntry[] || []),
      insightBlockTitle: insightsBlock?.title || "重點洞察說明",
      suggestionData: (suggestionsBlock?.data as SuggestionEntry[] || []),
      chartData: (chartsBlock?.data as ChartDefinition[] || []),
      chartBlockTitle: chartsBlock?.title || "指標數據圖表",
      definitions: performanceBlock?.definitions || {},
      summaryInsights: insightsBlock?.summary || [],
      summarySuggestions: suggestionsBlock?.summary || [],
      summaryCharts: chartsBlock?.summary || [],
      authError: null,
      loadingState: null,
    };
  }, [rawData]);

  const overallSummary = useMemo(() => {
    return [...summaryInsights, ...summarySuggestions, ...summaryCharts].filter(Boolean);
  },[summaryInsights, summarySuggestions, summaryCharts]);

  const handleJsonUpdate = (): boolean => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      let newData;
      let newSellerName: string | null = null;
      let newReportPeriod: string | null = null;

      // Handle both new format (with metadata) and old format (array only)
      if (parsedJson && parsedJson.metadata) {
        newSellerName = parsedJson.metadata.seller || null;
        newReportPeriod = parsedJson.metadata.reportPeriod || null;
        newData = parsedJson.data;
      } else {
        newData = parsedJson;
        // Reset metadata if old format is loaded
        newSellerName = null;
        newReportPeriod = null;
      }

      const isAuthErrorData = Array.isArray(newData) && newData.length > 0 && newData[0].type === 'error_message' && newData[0].error_code === 'NO_AUTH';
      const isLoadingData = Array.isArray(newData) && newData.length > 0 && (newData[0].type === 'get_data' || newData[0].type === 'pending');

      if (!isAuthErrorData && !isLoadingData) {
        if (!Array.isArray(newData) || newData.length === 0) {
          throw new Error("Input must be a non-empty JSON array.");
        }
        if (!newData.some((block: any) => block.type === 'data_array' && block.title.includes('成效總覽'))) {
            throw new Error("JSON is missing a required performance data block (like '商品 × 廣告類型成效總覽').");
        }
      }
      
      setRawData(newData);
      setSellerName(newSellerName);
      setReportPeriod(newReportPeriod);
      setJsonError(null);
      return true;
    } catch (error: any) {
      setJsonError(`Invalid JSON format: ${error.message}`);
      return false;
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header 
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          handleUpdate={handleJsonUpdate}
          error={jsonError}
          reportPeriod={reportPeriod}
          sellerName={sellerName}
        />

        {authError ? (
          <AuthError title={authError.title} message={authError.message} />
        ) : loadingState ? (
          <LoadingState title={loadingState.title} message={loadingState.message} />
        ) : (
          <>
            <SummarySection title="總體摘要與定義" summary={overallSummary} definitions={definitions} />

            <ChartsDashboard title={chartBlockTitle} charts={chartData} />

            <PerformanceTable title={performanceBlockTitle} data={performanceData} definitions={definitions} />
            
            <InsightsSection 
              title={insightBlockTitle}
              insights={insightData}
              suggestions={suggestionData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;