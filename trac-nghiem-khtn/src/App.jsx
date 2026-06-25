import React, { useState, useEffect } from 'react';

// --- HÀM XÁO TRỘN ĐÁP ÁN ---
const shuffleOptionsForQuiz = (data) => {
  return data.map(question => {
    let optionsList = question.options.map((text, index) => {
      const cleanText = text.replace(/^[A-D][\.\:]\s*/i, ''); 
      return { text: cleanText, isCorrect: index === question.correctAnswer };
    });

    for (let i = optionsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsList[i], optionsList[j]] = [optionsList[j], optionsList[i]];
    }

    const newCorrectAnswerIndex = optionsList.findIndex(opt => opt.isCorrect);
    const formattedOptions = optionsList.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt.text}`);

    return { ...question, options: formattedOptions, correctAnswer: newCorrectAnswerIndex };
  });
};

// --- COMPONENT LÀM BÀI TRẮC NGHIỆM ---
const QuizPlayer = ({ title, rawQuizData, onBack }) => {
  const [quizStateData, setQuizStateData] = useState(() => shuffleOptionsForQuiz(rawQuizData));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(rawQuizData.length).fill(null)); 
  const [showResult, setShowResult] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnswerClick = (index) => {
    if (userAnswers[currentQuestion] !== null) return; 
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);

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
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const restartQuiz = () => {
    setQuizStateData(shuffleOptionsForQuiz(rawQuizData)); 
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers(Array(rawQuizData.length).fill(null));
    setShowResult(false);
  };

  const progressPercentage = ((currentQuestion + 1) / quizStateData.length) * 100;

  // Styles cho QuizPlayer
  const cardStyle = {
    backgroundColor: '#fff', width: '100%', maxWidth: '750px',
    padding: isMobile ? '20px' : '40px', borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', boxSizing: 'border-box',
    margin: '0 auto'
  };

  const optionStyle = (index) => {
    let bgColor = '#fdfdfd', borderColor = '#e0e0e0', textColor = '#000'; 
    const selectedInThisQuestion = userAnswers[currentQuestion];

    if (selectedInThisQuestion !== null) {
      if (index === quizStateData[currentQuestion].correctAnswer) { bgColor = '#d1e7dd'; borderColor = '#badbcc'; } 
      else if (index === selectedInThisQuestion) { bgColor = '#f8d7da'; borderColor = '#f5c6cb'; }
    }

    return {
      display: 'block', width: '100%', padding: isMobile ? '12px 15px' : '16px 20px', margin: '10px 0',
      textAlign: 'left', backgroundColor: bgColor, color: textColor, border: `2px solid ${borderColor}`,
      borderRadius: '10px', cursor: selectedInThisQuestion === null ? 'pointer' : 'not-allowed',
      fontSize: isMobile ? '16px' : '19px', fontFamily: '"Times New Roman", Times, serif',
      transition: 'all 0.2s ease', boxSizing: 'border-box',
      opacity: (selectedInThisQuestion !== null && index !== selectedInThisQuestion && index !== quizStateData[currentQuestion].correctAnswer) ? 0.5 : 1
    };
  };

  const btnStyle = {
    padding: isMobile ? '10px 20px' : '12px 28px', fontSize: isMobile ? '16px' : '18px',
    fontFamily: 'inherit', color: '#fff', backgroundColor: '#007bff', border: 'none',
    borderRadius: '8px', cursor: 'pointer', marginTop: '10px'
  };

  return (
    <div style={cardStyle}>
      {showResult ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '50px' }}>🎉</div>
          <div style={{ fontSize: isMobile ? '20px' : '24px', margin: '15px 0' }}>Kết quả bài tập: {title}</div>
          <div style={{ fontSize: '18px' }}>🦍🐒 đạt được: {score} / {quizStateData.length} câu đúng</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button onClick={restartQuiz} style={{...btnStyle, backgroundColor: '#28a745'}}>Làm lại</button>
            <button onClick={onBack} style={{...btnStyle, backgroundColor: '#6c757d'}}>Về danh sách đề</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginBottom: '15px', padding: 0, fontFamily: 'inherit', fontSize: '16px' }}>&larr; Trở lại</button>
          
          <div style={{ height: '6px', backgroundColor: '#eee', borderRadius: '3px', marginBottom: '15px' }}>
            <div style={{ height: '100%', backgroundColor: '#4facfe', width: `${progressPercentage}%`, transition: 'width 0.3s' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontSize: '14px' }}>
            <span>Câu {currentQuestion + 1} / {quizStateData.length}</span>
            <span>Điểm: {score} 🐳🐳</span>
          </div>
          
          <div style={{ marginBottom: '20px', fontSize: isMobile ? '18px' : '22px', textAlign: 'justify', lineHeight: '1.4' }}>
            {quizStateData[currentQuestion].question}
          </div>

          <div>
            {quizStateData[currentQuestion].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswerClick(idx)} disabled={userAnswers[currentQuestion] !== null} style={optionStyle(idx)}>{opt}</button>
            ))}
          </div>

          <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center' }}>
            {currentQuestion > 0 && (
              <button onClick={handlePreviousQuestion} style={{...btnStyle, backgroundColor: '#6c757d', marginRight: 'auto'}}>&#10229; Trước</button>
            )}
            {userAnswers[currentQuestion] !== null && (
              <button onClick={handleNextQuestion} style={{...btnStyle, marginLeft: 'auto'}}>
                {currentQuestion + 1 === quizStateData.length ? 'Xem kết quả' : 'Tiếp theo \u279C'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT (DASHBOARD & ROUTING) ---
export default function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null); // Lưu trữ bộ đề đang làm
  
  // States cho form nhập đề mới
  const [jsonInput, setJsonInput] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [error, setError] = useState('');

  // Tải danh sách đề từ LocalStorage khi khởi chạy
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('myQuizzes');
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
  }, []);

  // Cập nhật LocalStorage mỗi khi danh sách đề thay đổi
  useEffect(() => {
    localStorage.setItem('myQuizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        setJsonInput(JSON.stringify(parsedData, null, 2));
        if (!quizTitle) setQuizTitle(file.name.replace('.json', ''));
        setError('');
      } catch (err) {
        setError('File không đúng định dạng JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) {
      setError('Vui lòng nhập tên đề thi.');
      return;
    }
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData)) throw new Error('Dữ liệu phải là một mảng (Array).');
      
      const newQuiz = { id: Date.now().toString(), title: quizTitle, data: parsedData };
      setQuizzes([...quizzes, newQuiz]);
      setJsonInput('');
      setQuizTitle('');
      setError('');
    } catch (err) {
      setError('JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.');
    }
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề này?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  const pageStyle = {
    minHeight: '100vh', padding: '20px', boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    fontFamily: '"Times New Roman", Times, serif', display: 'flex',
    flexDirection: 'column', alignItems: 'center'
  };

  const inputStyle = {
    width: '100%', padding: '10px', margin: '8px 0', borderRadius: '6px',
    border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '16px'
  };

  return (
    <div style={pageStyle}>
      {activeQuiz ? (
        <QuizPlayer 
          title={activeQuiz.title} 
          rawQuizData={activeQuiz.data} 
          onBack={() => setActiveQuiz(null)} 
        />
      ) : (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '800px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', marginTop: 0 }}>Quản Lý Đề Trắc Nghiệm</h1>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <h3 style={{ marginTop: 0 }}>Thêm đề thi mới</h3>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <input type="text" placeholder="Tên đề thi (VD: Bài tập Sinh học lớp 7)" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} style={inputStyle} />
            <input type="file" accept=".json" onChange={handleFileUpload} style={{...inputStyle, border: 'none', padding: '10px 0'}} />
            <textarea 
              placeholder={`Ví dụ định dạng:\n[\n  {\n    "question": "Từ trường là vùng không gian bao quanh vật nào sau đây?",\n    "options": ["A. Một thanh gỗ", "B. Một viên nhựa", "C. Một nam châm hoặc dây dẫn mang dòng điện", "D. Một quả cầu thủy tinh"],\n    "correctAnswer": 2\n  }\n]`} 
              rows="8" 
              value={jsonInput} 
              onChange={(e) => setJsonInput(e.target.value)} 
              style={{...inputStyle, resize: 'vertical'}} 
            />
            
            <button onClick={handleSaveQuiz} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '18px', cursor: 'pointer', marginTop: '10px', fontFamily: 'inherit' }}>
              Lưu Đề Thi
            </button>
          </div>

          <div>
            <h3>Danh sách đề thi đã lưu ({quizzes.length})</h3>
            {quizzes.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có đề thi nào. Hãy thêm đề mới ở trên.</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {quizzes.map((quiz) => (
                  <div key={quiz.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{quiz.title} <span style={{fontSize: '14px', fontWeight: 'normal', color: '#666'}}>({quiz.data.length} câu)</span></div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setActiveQuiz(quiz)} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>Làm bài</button>
                      <button onClick={() => handleDeleteQuiz(quiz.id)} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}