import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề quiz');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await api.post<{ quizId: number }>('/quizzes', { title });
      const quizId = data.quizId;

      if (file) {
        const fd = new FormData();
        fd.append('jar', file);
        await api.post(`/quizzes/${quizId}/upload`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate(`/quiz/${quizId}`);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.status === 401
          ? 'Bạn chưa đăng nhập hoặc phiên đã hết hạn'
          : 'Có lỗi xảy ra khi tạo quiz'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create New Quiz
        </h2>

        {error && (
          <div className="text-red-600 text-sm bg-red-100 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Upload JAR File (optional)
            </label>
            <input
              type="file"
              accept=".jar"
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {isLoading ? 'Creating...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
