import React, { useState, useEffect } from 'react';
import quizData from './data/data_JSON.json'; 

// Hàm dùng để xáo trộn đáp án và cập nhật lại correctAnswer
const shuffleOptionsForQuiz = (data) => {
  return data.map(question => {
    // 1. Tạo mảng object chứa text (đã lột bỏ A., B., C., D. nếu có) và đánh dấu đáp án đúng
    let optionsList = question.options.map((text, index) => {
      const cleanText = text.replace(/^[A-D][\.\:]\s*/i, ''); // Xóa chữ A. B. ở đầu
      return {
        text: cleanText,
        isCorrect: index === question.correctAnswer
      };
    });

    // 2. Thuật toán Fisher-Yates để xáo trộn mảng optionsList
    for (let i = optionsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsList[i], optionsList[j]] = [optionsList[j], optionsList[i]];
    }

    // 3. Tìm lại vị trí mới của đáp án đúng sau khi đã đảo
    const newCorrectAnswerIndex = optionsList.findIndex(opt => opt.isCorrect);

    // 4. Gắn lại tiền tố A, B, C, D theo thứ tự hiển thị mới
    const formattedOptions = optionsList.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt.text}`);

    // Trả về object câu hỏi mới
    return {
      ...question,
      options: formattedOptions,
      correctAnswer: newCorrectAnswerIndex
    };
  });
};

export default function App() {
  // Khởi tạo state bằng hàm shuffle để ngay lần đầu vào web đáp án đã được đảo
  const [quizStateData, setQuizStateData] = useState(() => shuffleOptionsForQuiz(quizData));
  
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

    // Dùng quizStateData thay vì quizData để check đúng sai
    if (index === quizStateData[currentQuestion].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizStateData.length) {
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
    // Gọi lại hàm shuffle để đảo lại đáp án cho lần làm mới
    setQuizStateData(shuffleOptionsForQuiz(quizData)); 
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers(Array(quizData.length).fill(null));
    setShowResult(false);
  };

  const progressPercentage = ((currentQuestion + 1) / quizStateData.length) * 100;

  // --- STYLES ---
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
    let textColor = '#000'; 
    const selectedInThisQuestion = userAnswers[currentQuestion];

    if (selectedInThisQuestion !== null) {
      if (index === quizStateData[currentQuestion].correctAnswer) {
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
      color: textColor, 
      border: `2px solid ${borderColor}`,
      borderRadius: '10px',
      cursor: selectedInThisQuestion === null ? 'pointer' : 'not-allowed',
      fontSize: isMobile ? '16px' : '19px',
      fontFamily: '"Times New Roman", Times, serif', 
      fontWeight: 'normal', 
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      opacity: (selectedInThisQuestion !== null && index !== selectedInThisQuestion && index !== quizStateData[currentQuestion].correctAnswer) ? 0.5 : 1
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
    marginRight: 'auto' 
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {showResult ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px' }}>🎉</div>
            <div style={{ fontSize: isMobile ? '20px' : '24px', margin: '15px 0' }}>Kết quả bài tập</div>
            <div style={{ fontSize: '18px' }}>🦍🐒 đạt được: {score} / {quizStateData.length} câu đúng</div>
            <button onClick={restartQuiz} style={{...btnNextStyle, backgroundColor: '#28a745', marginTop: '20px'}}>Làm lại từ đầu</button>
          </div>
        ) : (
          <div>
            <div style={{ height: '6px', backgroundColor: '#eee', borderRadius: '3px', marginBottom: '15px' }}>
              <div style={{ height: '100%', backgroundColor: '#4facfe', width: `${progressPercentage}%`, transition: 'width 0.3s' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontSize: '14px' }}>
              <span>Câu {currentQuestion + 1} / {quizStateData.length}</span>
              <span>Điểm hiện tại: {score} 🐳🐳</span>
            </div>
            
            <div style={{ marginBottom: '20px', fontSize: isMobile ? '18px' : '22px', textAlign: 'justify', lineHeight: '1.4' }}>
              {quizStateData[currentQuestion].question}
            </div>

            <div>
              {quizStateData[currentQuestion].options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswerClick(index)} 
                  disabled={userAnswers[currentQuestion] !== null} 
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
                  {currentQuestion + 1 === quizStateData.length ? 'Xem kết quả' : 'Câu tiếp theo \u279C'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}