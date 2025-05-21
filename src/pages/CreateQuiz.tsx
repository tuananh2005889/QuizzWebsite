// src/pages/CreateQuiz.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import './CreateQuiz.css';

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
      // Tạo quiz
      const { data } = await api.post<{ quizId: number }>('/quizzes', { title });
      const quizId = data.quizId;

      // Nếu có file, upload thêm
      if (file) {
        const fd = new FormData();
        fd.append('jar', file);
        await api.post(`/quizzes/${quizId}/upload`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate(`/quiz/${quizId}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Bạn chưa đăng nhập hoặc phiên đã hết hạn');
      } else {
        setError('Có lỗi xảy ra khi tạo quiz');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <div className="create-quiz-card">
        <h2 className="create-quiz-title">Create New Quiz</h2>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label htmlFor="quiz-title">Quiz Title</label>
          <input
            id="quiz-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter quiz title"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quiz-file">Upload JAR File (optional)</label>
          <input
            id="quiz-file"
            type="file"
            accept=".jar"
            onChange={e => setFile(e.target.files?.[0] || null)}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
