export interface PerformanceEntry {
  gno: number | string;
  g_name: string;
  ad_type: string;
  impression: number;
  click: number;
  cost: number;
  orders: number;
  revenue: number;
  CVR: number;
  ROAS: number | string; // ROAS can be "N/A"
  GMV: number;
}

export interface InsightEntry {
  gno: number | string;
  g_name: string;
  best_ad: string;
  best_roas: number | string;
  worst_ad: string;
  worst_roas: number | string;
}

export interface SuggestionEntry {
  gno: number | string;
  g_name: string;
  suggestion: string;
}

export interface BarChartSeries {
  name: string;
  data: number[];
}

export interface PieChartDataPoint {
    name: string;
    value: number;
}

// Discriminated union for charts
export type BarChartDefinition = {
    chart_type: 'bar';
    title: string;
    x_axis: string;
    series: BarChartSeries[];
    labels: string[];
}

export type PieChartDefinition = {
    chart_type: 'pie';
    title: string;
    series: PieChartDataPoint[];
}

export type ChartDefinition = BarChartDefinition | PieChartDefinition;


export interface StandardDataBlock {
  type: 'data_array' | 'suggestion' | 'chart';
  title: string;
  data: PerformanceEntry[] | InsightEntry[] | SuggestionEntry[] | ChartDefinition[];
  definitions?: { [key: string]: string };
  summary?: string[];
}

export interface LoadingBlock {
    type: 'get_data' | 'pending';
    title: string;
    message: string;
}

export interface ErrorBlock {
    type: 'error_message';
    title: string;
    error_code: 'NO_AUTH';
    message: string;
}

export type DataBlock = StandardDataBlock | ErrorBlock | LoadingBlock;