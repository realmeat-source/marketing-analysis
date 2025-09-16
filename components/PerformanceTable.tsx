
import React, { useState, useMemo } from 'react';
import { PerformanceEntry } from '../types';
import { Card } from './Card';

interface PerformanceTableProps {
  title: string;
  data: PerformanceEntry[];
  definitions: { [key: string]: string };
}

type SortKey = keyof PerformanceEntry;
interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

const TableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
    </svg>
);

const SortIcon: React.FC<{ direction?: 'ascending' | 'descending' }> = ({ direction }) => {
    if (!direction) return <span className="text-slate-400">↕</span>;
    return direction === 'ascending' ? <span className="text-slate-800">↑</span> : <span className="text-slate-800">↓</span>;
};

const headers: { key: SortKey; label: string; isNumeric: boolean }[] = [
    { key: 'g_name', label: '商品名稱', isNumeric: false },
    { key: 'ad_type', label: '廣告類型', isNumeric: false },
    { key: 'impression', label: '曝光', isNumeric: true },
    { key: 'click', label: '點擊', isNumeric: true },
    { key: 'cost', label: '花費', isNumeric: true },
    { key: 'orders', label: '訂單', isNumeric: true },
    { key: 'revenue', label: '銷售額', isNumeric: true },
    { key: 'CVR', label: 'CVR(%)', isNumeric: true },
    { key: 'ROAS', label: 'ROAS', isNumeric: true },
    { key: 'GMV', label: 'GMV', isNumeric: true },
];

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ title, data, definitions }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'ROAS', direction: 'descending' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <Card title={title} titleIcon={<TableIcon />}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                        {headers.map(({ key, label }) => (
                            <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key)} title={definitions[label.replace('(%)', '')] || ''}>
                                <div className="flex items-center gap-2">
                                    {label}
                                    <SortIcon direction={sortConfig?.key === key ? sortConfig.direction : undefined} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, index) => (
                        <tr key={`${item.gno}-${item.ad_type}-${index}`} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">{item.g_name}</td>
                            <td className="px-6 py-4">{item.ad_type}</td>
                            <td className="px-6 py-4">{formatNumber(item.impression)}</td>
                            <td className="px-6 py-4">{formatNumber(item.click)}</td>
                            <td className="px-6 py-4">{formatNumber(item.cost)}</td>
                            <td className="px-6 py-4">{formatNumber(item.orders)}</td>
                            <td className="px-6 py-4">{formatNumber(item.revenue)}</td>
                            <td className="px-6 py-4">{item.CVR}</td>
                            <td className="px-6 py-4">{item.ROAS}</td>
                            <td className="px-6 py-4">{formatNumber(item.GMV)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
  );
};
