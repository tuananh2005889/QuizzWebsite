// src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      await axios.post('/api/auth/register', { username, password });
      nav('/login');
    } catch (err: any) {
      // handle error similarly if needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="
        w-full max-w-md p-8
        bg-white bg-opacity-80 backdrop-blur-md
        rounded-2xl shadow-xl
        transform transition duration-500 hover:scale-105
      ">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="
            w-full mb-4 px-4 py-3
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-4 focus:ring-purple-200
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
            focus:outline-none focus:ring-4 focus:ring-purple-200
            transition duration-300
          "
        />

        <button
          onClick={submit}
          className="
            w-full py-3 rounded-lg
            bg-gradient-to-r from-purple-500 to-indigo-500
            hover:from-indigo-500 hover:to-purple-500
            text-white font-semibold
            transform transition duration-300 hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-indigo-200
          "
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link
            to="/login"
            className="font-medium text-purple-600 hover:text-indigo-600 transition duration-200"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
