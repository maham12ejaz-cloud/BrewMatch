import './ProgressBar.css';

function ProgressBar({ current, total }) {
  const progress = ((current - 1) / total) * 100;

  return (
    <div className="progress-container">

      <div className="progress-info">
        <span>Question {current} of {total}</span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
}

export default ProgressBar;