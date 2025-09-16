
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartDefinition, BarChartDefinition } from '../types';
import { Card } from './Card';

interface ChartsDashboardProps {
  title: string;
  charts: ChartDefinition[];
}

const chartColors = ['#f97316', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#14b8a6'];

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18.7 8a2 2 0 0 1 0 2.8l-6 6a2 2 0 0 1-2.8 0l-4-4a2 2 0 0 1 0-2.8l6-6a2 2 0 0 1 2.8 0Z" />
    </svg>
);


export const ChartsDashboard: React.FC<ChartsDashboardProps> = ({ title, charts }) => {
  const transformedBarData = (chart: BarChartDefinition) => {
    return chart.labels.map((label, index) => {
      const dataPoint: { name: string; [key: string]: string | number } = { name: label };
      chart.series.forEach(s => {
        dataPoint[s.name] = s.data[index] ?? 0;
      });
      return dataPoint;
    });
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Do not render label for very small slices

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card title={title} titleIcon={<ChartIcon />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((chart, chartIndex) => (
          <div key={chartIndex} className="bg-white p-4 rounded-lg border border-slate-200 h-96">
            <h3 className="font-semibold text-slate-800 mb-4 text-center">{chart.title}</h3>
            <ResponsiveContainer width="100%" height="100%">
              {chart.chart_type === 'bar' ? (
                  <BarChart data={transformedBarData(chart)} margin={{ top: 5, right: 20, left: -10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fill: '#475569' }} height={80} interval={0} fontSize={12} />
                    <YAxis tick={{ fill: '#475569' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.5rem',
                      }}
                      labelStyle={{ color: '#1e293b' }}
                    />
                    <Legend wrapperStyle={{paddingTop: '20px'}}/>
                    {chart.series.map((s, seriesIndex) => (
                      <Bar key={s.name} dataKey={s.name} fill={chartColors[seriesIndex % chartColors.length]} />
                    ))}
                  </BarChart>
              ) : ( // Pie chart
                  <PieChart>
                     <Pie
                        data={chart.series}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {chart.series.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${Number(value).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e2e8f0',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Legend wrapperStyle={{paddingTop: '40px', bottom: 0}} />
                  </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </Card>
  );
};