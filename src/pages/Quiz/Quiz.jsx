
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Quiz.css';

import quizquestions from '../../data/quizquestions';

import QuizQuestion from '../../components/QuizQuestion/QuizQuestion';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Button from '../../components/Button/Button';
import Loading from '../../components/Loading/Loading';

import coffees from '../../data/coffees';

import getRecommendations from '../../utils/recomendation';

function Quiz() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const question = quizquestions[currentQuestion];

  // ===============================
  // Select Answer
  // ===============================

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  // ===============================
  // Next Question
  // ===============================

  const handleNext = () => {
    if (!selectedAnswer) {
      return;
    }

    const updatedAnswers = {
      ...answers,
      [question.id]: selectedAnswer
    };

    setAnswers(updatedAnswers);

    // ===============================
    // More Questions Remaining
    // ===============================

    if (
      currentQuestion <
      quizquestions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );

      setSelectedAnswer('');

      return;
    }

    // ===============================
    // Quiz Completed
    // ===============================

    setIsLoading(true);

    setTimeout(() => {
      const recommendations =
        getRecommendations(
          updatedAnswers,
          coffees
        );

      sessionStorage.setItem(
        'brewmatch-results',
        JSON.stringify(recommendations)
      );

      navigate('/result');
    }, 1500);
  };

  // ===============================
  // Loading Screen
  // ===============================

  if (isLoading) {
    return <Loading />;
  }

  // ===============================
  // Quiz Screen
  // ===============================

  return (
    <main className="quiz-page">

      <div className="quiz-container">

        {/* Quiz Header */}

        <div className="quiz-header">

          <span className="quiz-label">
            Personalized Coffee Finder
          </span>

          <h1>
            Find Your Perfect Coffee
          </h1>

          <p>
            Answer a few simple questions and
            discover coffees that match your taste.
          </p>

        </div>

        {/* Progress Bar */}
        <div className="quiz-progress">
          <ProgressBar
            current={currentQuestion + 1}
            total={quizquestions.length}
          />

        </div>

        {/* Question */}

        <div className="quiz-content"a>

          <QuizQuestion
            question={question}
            selectedAnswer={selectedAnswer}
            onSelect={handleAnswerSelect}
          />

        </div>

        {/* Navigation */}

        <div className="quiz-navigation">

          <Button onClick={handleNext}>
            {currentQuestion ===
            quizquestions.length - 1
              ? 'See My Matches'
              : 'Next Question →'}
          </Button>

        </div>

      </div>

    </main>
  );
}

export default Quiz;
