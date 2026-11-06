import './QuizQuestion.css';

function QuizQuestion({ question, selectedAnswer, onSelect }) {
  return (
    <div className="quiz-question">

      <h2>{question.question}</h2>

      <div className="quiz-options">
        {question.options.map((option) => (
          <button
            key={option}
            className={`quiz-option ${
              selectedAnswer === option ? 'selected' : ''
            }`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

    </div>
  );
}

export default QuizQuestion;