import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function AddTransaction() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: '', amount: '', type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.categoryId || !form.amount || !form.date)
      return setError('Please fill all required fields');
    if (isNaN(form.amount) || Number(form.amount) <= 0)
      return setError('Enter a valid amount');
    try {
      await api.post('/transactions', { ...form, amount: Number(form.amount) });
      setSuccess('Transaction added successfully! 🎉');
      setTimeout(() => navigate('/transactions'), 1500);
    } catch {
      setError('Failed to add transaction');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-3">
            {['INCOME', 'EXPENSE'].map(t => (
              <motion.button key={t} type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition text-sm ${
                  form.type === t
                    ? t === 'INCOME'
                      ? 'bg-green-500 text-white shadow'
                      : 'bg-red-500 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{t}</motion.button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input type="number" step="0.01" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="0.00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white">
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <input type="text" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="e.g. Zomato order, Salary April" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Add Transaction
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}