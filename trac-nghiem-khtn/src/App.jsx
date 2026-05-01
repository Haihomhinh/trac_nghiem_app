import React, { useState } from 'react';
import quizData from './data/khtn7.json'; 

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswerClick = (index) => {
    if (selectedOption !== null) return; 
    setSelectedOption(index);
    if (index === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null); 
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  // Tính toán phần trăm cho thanh tiến trình
  const progressPercentage = ((currentQuestion) / quizData.length) * 100;

  // Style cho toàn bộ trang web (thêm nền gradient)
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Nền gradient sinh động
    padding: '20px',
    fontFamily: '"Times New Roman", Times, serif',
    fontWeight: 'normal',
    color: '#000'
  };

  // Style cho khung làm bài (Card)
  const cardStyle = {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '750px',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', // Đổ bóng nổi bật
    position: 'relative'
  };

  // Style cho thanh tiến trình
  const progressContainerStyle = {
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    marginBottom: '20px',
    overflow: 'hidden'
  };

  const progressFillStyle = {
    height: '100%',
    backgroundColor: '#4facfe',
    width: `${progressPercentage}%`,
    transition: 'width 0.4s ease'
  };

  const optionStyle = (index) => {
    let bgColor = '#fdfdfd';
    let borderColor = '#e0e0e0';

    if (selectedOption !== null) {
      if (index === quizData[currentQuestion].correctAnswer) {
        bgColor = '#d1e7dd'; 
        borderColor = '#badbcc';
      } else if (index === selectedOption) {
        bgColor = '#f8d7da'; 
        borderColor = '#f5c6cb';
      }
    }

    return {
      display: 'block',
      width: '100%',
      padding: '16px 20px',
      margin: '12px 0',
      textAlign: 'left',
      backgroundColor: bgColor,
      color: '#000', 
      border: `2px solid ${borderColor}`,
      borderRadius: '10px', // Bo góc tròn hơn
      cursor: selectedOption === null ? 'pointer' : 'default',
      fontFamily: 'inherit',
      fontWeight: 'normal', 
      fontSize: '19px', // Chữ to rõ ràng
      transition: 'all 0.2s ease'
    };
  };

  const btnStyle = {
    padding: '12px 28px',
    fontSize: '18px',
    fontFamily: 'inherit',
    fontWeight: 'normal',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '25px',
    display: 'block',
    marginLeft: 'auto',
    boxShadow: '0 4px 6px rgba(0,123,255,0.2)'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {showResult ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>🎉</div>
            <div style={{ fontSize: '28px', marginBottom: '15px' }}>Chúc mừng bạn đã hoàn thành!</div>
            <div style={{ fontSize: '22px', marginBottom: '30px' }}>
              Số điểm đạt được: {score} / {quizData.length}
            </div>
            <button onClick={restartQuiz} style={{...btnStyle, margin: '0 auto', backgroundColor: '#28a745', float: 'none'}}>
              Làm lại bài kiểm tra 🔄
            </button>
          </div>
        ) : (
          <div>
            {/* Thanh tiến trình */}
            <div style={progressContainerStyle}>
              <div style={progressFillStyle}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#666', fontSize: '16px' }}>
              <span>Câu hỏi {currentQuestion + 1} trên {quizData.length}</span>
              <span>Điểm của bạn nhỏ: {score} 🦬🦬</span>
            </div>
            
            <div style={{ marginBottom: '30px', fontSize: '22px', lineHeight: '1.5' }}>
              {quizData[currentQuestion].question}
            </div>

            <div>
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedOption !== null}
                  style={optionStyle(index)}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <button onClick={handleNextQuestion} style={btnStyle}>
                Tiếp tục &#10140;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}