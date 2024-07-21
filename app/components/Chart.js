"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Chart = ({ data }) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <Line data={data} />
    </div>
  );
};

export default Chart;
