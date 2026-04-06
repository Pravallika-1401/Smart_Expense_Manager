import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError('All fields required');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm)
      return setError('Passwords do not match! ❌');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition">
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a9.77 9.77 0 012.168-3.568M6.343 6.343A9.956 9.956 0 0112 5c5 0 9 4 9 7a9.956 9.956 0 01-1.343 2.657M6.343 6.343L3 3m3.343 3.343l11.314 11.314M21 21l-3.343-3.343" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-1">Create Account ✨</h2>
        <p className="text-gray-400 text-sm mb-6">Start tracking your expenses today</p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Your name" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="you@email.com" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Min 6 characters" />
              <EyeIcon show={showPass} toggle={() => setShowPass(!showPass)} />
            </div>
            {/* Password strength */}
            {form.password && (
              <div className="mt-1.5 flex gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                    form.password.length >= i * 4
                      ? i === 1 ? 'bg-red-400'
                        : i === 2 ? 'bg-yellow-400'
                        : 'bg-green-400'
                      : 'bg-gray-200'
                  }`} />
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className={`w-full border rounded-xl px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 transition ${
                  form.confirm && form.password !== form.confirm
                    ? 'border-red-400 focus:ring-red-300'
                    : form.confirm && form.password === form.confirm
                    ? 'border-green-400 focus:ring-green-300'
                    : 'border-gray-300 focus:ring-indigo-400'
                }`}
                placeholder="Re-enter password" />
              <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
            </div>
            {form.confirm && form.password !== form.confirm && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match ❌</p>
            )}
            {form.confirm && form.password === form.confirm && (
              <p className="text-xs text-green-500 mt-1">Passwords match ✅</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition">
            {loading ? 'Creating...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}