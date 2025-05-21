import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [quizName, setQuizName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizName || !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('name', quizName);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/api/quizzes', formData);
      navigate(`/quiz/${response.data.id}`);
    } catch (error) {
      console.error('Error uploading quiz:', error);
      alert('Error uploading quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create New Quiz</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="quizName" className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Name
          </label>
          <input
            type="text"
            id="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Upload JAR File
          </label>
          <input
            type="file"
            id="file"
            accept=".jar"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default Home; 