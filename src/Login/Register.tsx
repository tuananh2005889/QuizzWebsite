import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [u,setU] = useState(''); const [pw,setPw]=useState('');
  const nav = useNavigate();

  const submit = async () => {
    await axios.post('/api/auth/register',{username:u,password:pw});
    nav('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        <input onChange={e=>setU(e.target.value)} placeholder="Username" className="input mb-4" />
        <input type="password" onChange={e=>setPw(e.target.value)} placeholder="Password" className="input mb-6" />
        <button onClick={submit} className="btn w-full">Register</button>
        <p className="mt-4 text-center">
          <Link to="/login" className="text-blue-600">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}