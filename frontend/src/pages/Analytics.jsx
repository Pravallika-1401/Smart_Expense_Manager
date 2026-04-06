import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import api from '../api/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const year = new Date().getFullYear();

  useEffect(() => {
    api.get(`/analytics/monthly?year=${year}`).then(r => setMonthlyData(r.data));
    api.get('/analytics/categories').then(r => setCategoryData(r.data));
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];

  const getArr = (type) => {
    const arr = new Array(12).fill(0);
    monthlyData.filter(d => d.type === type)
      .forEach(d => { arr[Number(d.month) - 1] = Number(d.total); });
    return arr;
  };

  const barData = {
    labels: months,
    datasets: [
      { label: 'Income (₹)', data: getArr('INCOME'),
        backgroundColor: 'rgba(34,197,94,0.75)', borderRadius: 6 },
      { label: 'Expense (₹)', data: getArr('EXPENSE'),
        backgroundColor: 'rgba(239,68,68,0.75)', borderRadius: 6 },
    ]
  };

  const lineData = {
    labels: months,
    datasets: [
      { label: 'Income', data: getArr('INCOME'),
        borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true, tension: 0.4 },
      { label: 'Expense', data: getArr('EXPENSE'),
        borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true, tension: 0.4 },
    ]
  };

  const pieLabels = Object.keys(categoryData);
  const pieColors = ['#6366f1','#f59e0b','#10b981','#ef4444',
    '#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#a855f7'];

  const pieData = {
    labels: pieLabels,
    datasets: [{
      data: Object.values(categoryData).map(Number),
      backgroundColor: pieColors.slice(0, pieLabels.length),
      borderWidth: 2, borderColor: '#fff',
    }]
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { ticks: {
      callback: v => `₹${Number(v).toLocaleString('en-IN')}`
    }}}
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Analytics Dashboard {year} 📊
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Monthly Income vs Expense
            </h3>
            <Bar data={barData} options={chartOpts} />
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Spending Trend
            </h3>
            <Line data={lineData} options={chartOpts} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Expense by Category
          </h3>
          {pieLabels.length === 0
            ? <p className="text-center text-gray-400 py-8">
                No expense data yet 📭
              </p>
            : <Pie data={pieData} options={{
                responsive: true,
                plugins: { legend: { position: 'right' }}
              }} />
          }
        </div>
      </motion.div>
    </div>
  );
}