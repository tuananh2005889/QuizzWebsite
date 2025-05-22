import { useEffect, useState } from 'react';
import axios from 'axios';

type Attempt = {
  id: number;
  title: string;
  score: number;
  total_questions: number;
  created_at: string;
};

export default function History() {
  const [list, setList] = useState<Attempt[]>([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    axios
      .get<Attempt[]>('http://localhost:3001/api/attempts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setList(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Lịch sử làm bài
      </h1>

      {list.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-white rounded-xl shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Quiz</th>
                <th className="px-4 py-3">Điểm</th>
                <th className="px-4 py-3">Số câu</th>
                <th className="px-4 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{a.title}</td>
                  <td className="px-4 py-3">{a.score.toFixed(1)}</td>
                  <td className="px-4 py-3">{a.total_questions}</td>
                  <td className="px-4 py-3">
                    {new Date(a.created_at).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">Chưa có lịch sử làm bài.</p>
      )}
    </div>
  );
}
