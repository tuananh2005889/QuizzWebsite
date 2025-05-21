// src/pages/Result.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Result.css';

type State = {
  score: number;
  totalQuestions: number;
  grade: number;
};

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { score, totalQuestions, grade } = (state as State) || {};

  useEffect(() => {
    if (score === undefined) {
      navigate('/dashboard');
    }
  }, [score, navigate]);

  return (
    <div className="result-container">
      <div className="result-card">
        <h2 className="result-title">Kết quả</h2>
        <p className="result-score">
          Bạn làm đúng <span className="highlight">{score}</span> /{' '}
          <span className="highlight">{totalQuestions}</span> câu
        </p>
        <p className="result-grade">
          Điểm: <span className="highlight">{grade.toFixed(1)}</span> / 10
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="dashboard-button"
        >
          Về Dashboard
        </button>
      </div>
    </div>
  );
}