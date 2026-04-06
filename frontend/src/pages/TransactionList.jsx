import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fmt = (n) =>
    `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  useEffect(() => {
    api.get('/transactions').then(r => {
      setTransactions(r.data);
      setFiltered(r.data);
      setLoading(false);
    });
  }, []);

  const handleFilter = async () => {
    if (!startDate || !endDate) return;
    const { data } = await api.get(
      `/transactions/filter?start=${startDate}&end=${endDate}`);
    setFiltered(data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    setFiltered(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Transactions</h2>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[130px]">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input type="date" value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="flex-1 min-w-[130px]">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input type="date" value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <button onClick={handleFilter}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            Filter
          </button>
          <button onClick={() => { setStartDate(''); setEndDate(''); setFiltered(transactions); }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Reset
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No transactions found</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Date','Category','Description','Amount','Type',''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((tx, i) => (
                    <motion.tr key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-500 text-xs">{tx.date}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {tx.categoryName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{tx.description || '—'}</td>
                      <td className={`px-4 py-3 font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'INCOME' ? '+' : '−'}{fmt(tx.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>{tx.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(tx.id)}
                          className="text-red-400 hover:text-red-600 text-xs font-medium transition">
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((tx, i) => (
                <motion.div key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">
                        {tx.description || tx.categoryName}
                      </p>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {tx.categoryName}
                      </span>
                    </div>
                    <span className={`font-bold text-base ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'INCOME' ? '+' : '−'}{fmt(tx.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{tx.date}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>{tx.type}</span>
                      <button onClick={() => handleDelete(tx.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}