import React, { useState, useEffect } from 'react';
import quizData from './data/khtn7_40.json'; 

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null)); 
  const [showResult, setShowResult] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnswerClick = (index) => {
    // Nếu câu này đã được trả lời rồi thì không cho chọn lại
    if (userAnswers[currentQuestion] !== null) return; 

    // Lưu đáp án vào mảng lịch sử
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);

    // Chỉ tính điểm ở lần đầu tiên tương tác với câu hỏi
    if (index === quizData[currentQuestion].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers(Array(quizData.length).fill(null));
    setShowResult(false);
  };

  const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100;

  // --- STYLES (Giữ nguyên phong cách Times New Roman của bạn) ---
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    padding: isMobile ? '10px' : '20px',
    fontFamily: '"Times New Roman", Times, serif',
    boxSizing: 'border-box'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '750px',
    padding: isMobile ? '20px' : '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    boxSizing: 'border-box'
  };

  const optionStyle = (index) => {
    let bgColor = '#fdfdfd';
    let borderColor = '#e0e0e0';
    let textColor = '#000'; // Mặc định là màu đen
    const selectedInThisQuestion = userAnswers[currentQuestion];

    if (selectedInThisQuestion !== null) {
      if (index === quizData[currentQuestion].correctAnswer) {
        bgColor = '#d1e7dd'; 
        borderColor = '#badbcc';
      } else if (index === selectedInThisQuestion) {
        bgColor = '#f8d7da'; 
        borderColor = '#f5c6cb';
      }
    }

    return {
      display: 'block',
      width: '100%',
      padding: isMobile ? '12px 15px' : '16px 20px',
      margin: '10px 0',
      textAlign: 'left',
      backgroundColor: bgColor,
      color: textColor, // Đảm bảo chữ luôn màu đen
      border: `2px solid ${borderColor}`,
      borderRadius: '10px',
      cursor: selectedInThisQuestion === null ? 'pointer' : 'not-allowed',
      fontSize: isMobile ? '16px' : '19px',
      fontFamily: '"Times New Roman", Times, serif', // Giữ font Times New Roman
      fontWeight: 'normal', // Không in đậm
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      // Giảm độ mờ của các câu không chọn để làm nổi bật đáp án nhưng vẫn phải đọc được
      opacity: (selectedInThisQuestion !== null && index !== selectedInThisQuestion && index !== quizData[currentQuestion].correctAnswer) ? 0.5 : 1
    };
  };
  
  const btnNextStyle = {
    padding: isMobile ? '10px 20px' : '12px 28px',
    fontSize: isMobile ? '16px' : '18px',
    fontFamily: 'inherit',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const btnBackStyle = {
    ...btnNextStyle,
    backgroundColor: '#6c757d',
    marginRight: 'auto' // Đẩy nút quay lại sang trái
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {showResult ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px' }}>🎉</div>
            <div style={{ fontSize: isMobile ? '20px' : '24px', margin: '15px 0' }}>Kết quả bài tập</div>
            <div style={{ fontSize: '18px' }}>Bạn đạt được: {score} / {quizData.length} câu đúng</div>
            <button onClick={restartQuiz} style={{...btnNextStyle, backgroundColor: '#28a745', marginTop: '20px'}}>Làm lại từ đầu</button>
          </div>
        ) : (
          <div>
            <div style={{ height: '6px', backgroundColor: '#eee', borderRadius: '3px', marginBottom: '15px' }}>
              <div style={{ height: '100%', backgroundColor: '#4facfe', width: `${progressPercentage}%`, transition: 'width 0.3s' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontSize: '14px' }}>
              <span>Câu {currentQuestion + 1} / {quizData.length}</span>
              <span>Điểm hiện tại: {score} 🐳💕</span>
            </div>
            
            <div style={{ marginBottom: '20px', fontSize: isMobile ? '18px' : '22px', textAlign: 'justify', lineHeight: '1.4' }}>
              {quizData[currentQuestion].question}
            </div>

            <div>
              {quizData[currentQuestion].options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswerClick(index)} 
                  disabled={userAnswers[currentQuestion] !== null} // KHÔNG cho tương tác lại
                  style={optionStyle(index)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center' }}>
              {currentQuestion > 0 && (
                <button onClick={handlePreviousQuestion} style={btnBackStyle}>&#10229; Xem lại câu trước</button>
              )}
              {userAnswers[currentQuestion] !== null && (
                <button onClick={handleNextQuestion} style={btnNextStyle}>
                  {currentQuestion + 1 === quizData.length ? 'Xem kết quả' : 'Câu tiếp theo \u279C'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}