"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data: Simulating AI-aggregated data from the Spring Boot backend
const data = [
  { name: 'IT Faculty', ideas: 420, approved: 240 },
  { name: 'HR Dept', ideas: 150, approved: 98 },
  { name: 'Business', ideas: 380, approved: 210 },
  { name: 'Design', ideas: 210, approved: 150 },
  { name: 'Library', ideas: 85, approved: 45 },
];

export default function IdeasChart() {
  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="ideas" name="Total Ideas" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
          <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}