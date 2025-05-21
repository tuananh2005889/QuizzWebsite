// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import './Dashboard.css';

type Quiz = {
  id: number;
  title: string;
  description?: string;
};

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Quiz[]>('/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          setError('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
        } else {
          setError('Không thể tải danh sách quizzes');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-msg">{error}</p>
        <Link to="/login" className="retry-button">Đăng nhập lại</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Quizzes</h1>
        <Link to="/create" className="create-button">
          + Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes yet. Get started by creating one!</p>
          <Link to="/create" className="create-button">Create Quiz</Link>
        </div>
      ) : (
        <div className="quiz-list">
          {quizzes.map(q => (
            <Link to={`/quiz/${q.id}`} key={q.id} className="quiz-card">
              <h3>{q.title}</h3>
              <p>{q.description || 'No description'}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="history-link-container">
        <Link to="/history" className="history-link">
          View History →
        </Link>
      </div>
    </div>
  );
}
