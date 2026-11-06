import './Button.css';

function Button({ children, type = 'button', onClick }) {
  return (
    <button
      className="custom-button"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;