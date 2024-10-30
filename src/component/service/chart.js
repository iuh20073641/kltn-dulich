// src/components/PieChart.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#198754', '#dc3545', '#ffc107', '#4BC0C0', '#9966FF', '#FF9F40'];

const CustomPieChart = ({ data }) => {

    // Tính tổng giá trị để tính phần trăm
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Hàm để hiển thị tỷ lệ phần trăm
  const renderLabel = ({ name, value }) => {
    const percent = ((value / total) * 100).toFixed(2);
    return `${name}: ${percent}%`;
  };

  return (
    <div className='flex justify-center'>
        <PieChart width={700} height={400}>
        <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={renderLabel}
        >
            {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
        <Legend />
        </PieChart>
    </div>
  );
};

export default CustomPieChart;
