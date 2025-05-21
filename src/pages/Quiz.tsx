// src/pages/Quiz.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css'; // We'll create this CSS file

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
      .get<Question[]>(
        `http://localhost:3001/api/quizzes/${quizId}/questions`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setQuestions(res.data))
      .catch((err) => {
        console.error(err);
        alert('Không lấy được câu hỏi.');
      })
      .finally(() => setLoading(false));
  }, [quizId, token]);

  const handleAnswer = (ans: Answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(ans);

    if (ans.is_correct) {
      setScore((s) => s + 1);
      setTimeout(nextQuestion, 1000);
    } else {
      setShowCorrect(true);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowCorrect(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // tính điểm trên thang 10
      const grade = (score / questions.length) * 10;
      // lưu attempt
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

  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (!questions.length) return <div className="empty-message">Chưa có câu hỏi.</div>;

  const q = questions[currentIndex];
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h2 className="question-counter">
          Câu {currentIndex + 1} / {questions.length}
        </h2>
        <p className="question-content">{q.content}</p>
        <div className="answers-container">
          {q.answers.map((ans) => {
            let answerClass = 'answer-button';
            if (selectedAnswer?.id === ans.id) {
              answerClass = ans.is_correct ? 'answer-button correct' : 'answer-button incorrect';
            }
            if (showCorrect && ans.is_correct) answerClass = 'answer-button correct';
            
            return (
              <button
                key={ans.id}
                onClick={() => handleAnswer(ans)}
                disabled={!!selectedAnswer}
                className={answerClass}
              >
                {ans.content}
              </button>
            );
          })}
        </div>
        {showCorrect && (
          <div className="next-button-container">
            <button
              onClick={nextQuestion}
              className="next-button"
            >
              Câu kế tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}