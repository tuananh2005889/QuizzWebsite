import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

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
    api
      .get<Quiz[]>('/quizzes')
      .then(res => setQuizzes(res.data))
      .catch(err => {
        console.error(err);
        setError(
          err.response?.status === 401
            ? 'Bạn chưa đăng nhập hoặc phiên đã hết hạn'
            : 'Không thể tải danh sách quizzes'
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-red-600">{error}</p>
        <Link
          to="/login"
          className="text-blue-500 hover:underline transition"
        >
          Đăng nhập lại
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Quizzes</h1>
        <Link
          to="/create"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No quizzes yet. Get started!</p>
          <Link
            to="/create"
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Create Quiz
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map(q => (
            <Link
              to={`/quiz/${q.id}`}
              key={q.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {q.title}
              </h3>
              <p className="text-gray-600">
                {q.description || 'No description'}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 text-right">
        <Link
          to="/history"
          className="text-blue-500 hover:underline transition"
        >
          View History →
        </Link>
      </div>
    </div>
  );
}
