// src/pages/History.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

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
      .then((res) => setList(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="history-container">
      <h1 className="history-title">Lịch sử làm bài</h1>
      {list.length ? (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Điểm</th>
                <th>Số câu</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.score.toFixed(1)}</td>
                  <td>{a.total_questions}</td>
                  <td>{new Date(a.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-message">Chưa có lịch sử làm bài.</p>
      )}
    </div>
  );
}