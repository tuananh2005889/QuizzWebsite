import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm text-center space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Kết quả</h2>
        <p className="text-gray-700">
          Bạn làm đúng{' '}
          <span className="font-bold text-blue-600">{score}</span> /{' '}
          {totalQuestions} câu
        </p>
        <p className="text-gray-700">
          Điểm:{' '}
          <span className="font-bold text-green-600">
            {grade.toFixed(1)}
          </span>{' '}
          / 10
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Về Dashboard
        </button>
      </div>
    </div>
  );
}
