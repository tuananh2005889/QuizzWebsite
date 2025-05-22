// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async () => {
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="
        w-full max-w-md p-8
        bg-white bg-opacity-80 backdrop-blur-md
        rounded-2xl shadow-xl
        transform transition duration-500 hover:scale-105
      ">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm animate-pulse">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="
            w-full mb-4 px-4 py-3
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-4 focus:ring-indigo-200
            transition duration-300
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="
            w-full mb-6 px-4 py-3
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-4 focus:ring-indigo-200
            transition duration-300
          "
        />

        <button
          onClick={submit}
          className="
            w-full py-3 rounded-lg
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-purple-500 hover:to-indigo-500
            text-white font-semibold
            transform transition duration-300 hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-purple-200
          "
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-purple-600 transition duration-200"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
