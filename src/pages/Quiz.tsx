import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

type Answer = {
  id: number;
  content: string;
  is_correct: boolean;
};

type Question = {
  id: number;
  content: string;
  answers: Answer[];
};

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Question[]>(`http://localhost:3001/api/quizzes/${quizId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setQuestions(res.data))
      .catch(err => {
        console.error(err);
        alert('Không lấy được câu hỏi.');
      })
      .finally(() => setLoading(false));
  }, [quizId, token]);

  const handleAnswer = (ans: Answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(ans);

    if (ans.is_correct) {
      setScore(s => s + 1);
      setTimeout(nextQuestion, 800);
    } else {
      setShowCorrect(true);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowCorrect(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
    } else {
      const grade = (score / questions.length) * 10;
      axios
        .post(
          `http://localhost:3001/api/quizzes/${quizId}/attempts`,
          { score, totalQuestions: questions.length },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          navigate(`/result/${quizId}`, {
            state: { score, totalQuestions: questions.length, grade },
          });
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải...
      </div>
    );
  }
  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chưa có câu hỏi.
      </div>
    );
  }

  const q = questions[currentIndex];
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-8 space-y-6">
        <div className="flex justify-between">
          <span className="text-black">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="font-semibold text-gray-800">Score: {score}</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">{q.content}</h2>

        <div className="grid gap-4 bg-white">
          {q.answers.map(ans => {
            const base =
              'p-4 border rounded-lg bg-white font-medium transition cursor-pointer';
            let style = base + ' hover:bg-gray-100';
            if (selectedAnswer?.id === ans.id) {
              style = ans.is_correct
                ? base + ' border-green-500 bg-green-100'
                : base + ' border-red-500 bg-red-100';
            }
            if (showCorrect && ans.is_correct) {
              style = base + ' border-green-500 bg-green-100';
            }
            return (
              <button
                key={ans.id}
                onClick={() => handleAnswer(ans)}
                disabled={!!selectedAnswer}
                className={style}
              >
                {ans.content}
              </button>
            );
          })}
        </div>

        {showCorrect && (
          <div className="text-right">
            <button
              onClick={nextQuestion}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Câu kế tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
