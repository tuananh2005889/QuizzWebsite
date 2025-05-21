// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');   // sửa tên biến rõ ràng
  const [password, setPassword] = useState('');   // sửa tên biến rõ ràng
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async () => {
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (err: any) {
      // hiển thị lỗi từ server hoặc chung chung
      setError(
        err.response?.data?.message ||
        'Không thể kết nối tới server'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-6 text-center">Đăng nhập</h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="input mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input mb-6"
        />

        <button
          onClick={submit}
          className="btn w-full"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
