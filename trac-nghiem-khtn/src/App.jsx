import React, { useState, useEffect } from 'react';
import quizData from './data/khtn7.json'; 

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Mẹo để nhận biết màn hình điện thoại hay máy tính
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const progressPercentage = ((currentQuestion) / quizData.length) * 100;

  // --- PHẦN STYLE ĐÃ TỐI ƯU CHO MOBILE ---
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    padding: isMobile ? '10px' : '20px', // Căn lề hẹp hơn trên điện thoại
    fontFamily: '"Times New Roman", Times, serif',
    fontWeight: 'normal',
    boxSizing: 'border-box'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '750px',
    padding: isMobile ? '20px' : '40px', // Tự động nhỏ padding lại
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    boxSizing: 'border-box'
  };

  const questionTextStyle = {
    marginBottom: '20px',
    fontSize: isMobile ? '18px' : '22px', // Tự động nhỏ chữ khi ở trên điện thoại
    lineHeight: '1.5',
    textAlign: 'justify' // Căn đều hai bên cho chuyên nghiệp
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
      padding: isMobile ? '12px 15px' : '16px 20px', // Nút đáp án nhỏ lại trên mobile
      margin: '10px 0',
      textAlign: 'left',
      backgroundColor: bgColor,
      color: '#000', 
      border: `2px solid ${borderColor}`,
      borderRadius: '10px',
      cursor: selectedOption === null ? 'pointer' : 'default',
      fontFamily: 'inherit',
      fontWeight: 'normal', 
      fontSize: isMobile ? '16px' : '19px', // Chữ đáp án cũng nhỏ lại
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    };
  };

  const btnStyle = {
    padding: isMobile ? '10px 20px' : '12px 28px',
    fontSize: isMobile ? '16px' : '18px',
    fontFamily: 'inherit',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    float: 'right'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {showResult ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px' }}>🎉</div>
            <div style={{ fontSize: isMobile ? '20px' : '24px', margin: '15px 0' }}>Hoàn thành bài tập!</div>
            <div style={{ fontSize: '18px' }}>Điểm: {score} / {quizData.length}</div>
            <button onClick={restartQuiz} style={{...btnStyle, float: 'none', margin: '20px auto', backgroundColor: '#28a745'}}>Làm lại</button>
          </div>
        ) : (
          <div>
            <div style={{ height: '6px', backgroundColor: '#eee', borderRadius: '3px', marginBottom: '15px' }}>
              <div style={{ height: '100%', backgroundColor: '#4facfe', width: `${progressPercentage}%`, transition: 'width 0.3s' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontSize: '14px' }}>
              <span>Câu {currentQuestion + 1} / {quizData.length}</span>
              <span>Điểm: {score} 🌟</span>
            </div>
            
            <div style={questionTextStyle}>
              {quizData[currentQuestion].question}
            </div>

            <div>
              {quizData[currentQuestion].options.map((option, index) => (
                <button key={index} onClick={() => handleAnswerClick(index)} disabled={selectedOption !== null} style={optionStyle(index)}>
                  {option}
                </button>
              ))}
            </div>

            {selectedOption !== null && (
              <button onClick={handleNextQuestion} style={btnStyle}>Tiếp tục &#10140;</button>
            )}
            <div style={{ clear: 'both' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}