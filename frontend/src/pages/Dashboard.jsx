import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/analytics/dashboard').then(r => setData(r.data));
    api.get('/transactions').then(r => setRecentTx(r.data.slice(0, 5)));
  }, []);

  const fmt = (n) =>
    `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const cards = [
    { label: 'Total Income', value: fmt(data?.totalIncome), color: 'border-green-400', text: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Expense', value: fmt(data?.totalExpense), color: 'border-red-400', text: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Balance', value: fmt(data?.balance), color: 'border-indigo-400', text: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Hi {user?.name}! 👋
        </h1>
        <p className="text-gray-400 text-sm mb-6">Here's your financial summary</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl shadow p-6 border-l-4 ${card.color}`}
            >
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Recent Transactions</h2>
            <Link to="/transactions"
              className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          {recentTx.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-3">No transactions yet!</p>
              <Link to="/add"
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                Add First Transaction
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      {tx.description || tx.categoryName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {tx.categoryName} • {tx.date}
                    </p>
                  </div>
                  <span className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}