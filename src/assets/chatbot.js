import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from './firebase'; // Updated import
import './chatbot.css';
import FingerCounter from './FingerCounter.js';


const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey there! 👋 How may I help you today?', level: null }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showLevels, setShowLevels] = useState(false);
  const [questions, setQuestions] = useState({});
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Fetch questions from Firestore
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const questionsCollection = collection(firestore, 'math_questions');
      const querySnapshot = await getDocs(questionsCollection);
      
      const questionsByLevel = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (!questionsByLevel[data.level]) {
          questionsByLevel[data.level] = [];
        }
        questionsByLevel[data.level].push({
          id: doc.id,
          ...data
        });
      });
      
      setQuestions(questionsByLevel);
    } catch (error) {
      console.error("Error fetching questions:", error);
      addBotMessage("Sorry, I couldn't load the questions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text, level = null) => {
    setMessages(prev => [...prev, { sender: 'bot', text, level }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    setInputValue('');

    // Simple responses for general chat
    const lowerInput = inputValue.toLowerCase();
    if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
      addBotMessage('Hello! Please select a level to start learning (1-10).');
    } else if (lowerInput.includes('thank')) {
      addBotMessage("You're welcome! 😊");
    } else if (lowerInput.includes('bye')) {
      addBotMessage("Goodbye! Come back anytime to learn more!");
    } else if (!currentLevel) {
      addBotMessage("Please select a level from 1 to 10 to get started!");
    } else if (currentLevel && questions[currentLevel] && questions[currentLevel][currentQuestionIndex]) {
      // If in a quiz, treat the message as an answer
      handleAnswer(inputValue);
    }
  };

  const handleLevelSelect = async (level) => {
    setCurrentLevel(level);
    setShowLevels(false);
    setCurrentQuestionIndex(0);
    
    if (!questions[level] || questions[level].length === 0) {
      // If we don't have questions for this level cached, try to fetch them
      setIsLoading(true);
      try {
        const q = query(
          collection(firestore, 'math_questions'),
          where("level", "==", level)
        );
        const querySnapshot = await getDocs(q);
        
        const levelQuestions = [];
        querySnapshot.forEach(doc => {
          levelQuestions.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setQuestions(prev => ({
          ...prev,
          [level]: levelQuestions
        }));
        
        if (levelQuestions.length > 0) {
          addBotMessage(`You selected Level ${level}. Let's begin!`, level);
          askQuestion(level, 0);
        } else {
          addBotMessage(`Sorry, no questions available for Level ${level} yet.`, level);
          setCurrentLevel(null);
        }
      } catch (error) {
        console.error("Error fetching level questions:", error);
        addBotMessage("Sorry, I couldn't load the questions for this level. Please try again later.");
        setCurrentLevel(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      addBotMessage(`You selected Level ${level}. Let's begin!`, level);
      askQuestion(level, 0);
    }
  };

  const askQuestion = (level, index) => {
    if (questions[level] && questions[level][index]) {
      const question = questions[level][index];
      addBotMessage(`Question: ${question.text}`, level);
    }
  };

  const handleAnswer = (answer) => {
    if (!currentLevel) return;

    const currentQuestion = questions[currentLevel][currentQuestionIndex];
    const isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase();

    addUserMessage(answer);
    
    if (isCorrect) {
      addBotMessage("Correct! 🎉 Well done!", currentLevel);
    } else {
      addBotMessage(`Oops! The correct answer is ${currentQuestion.answer}.`, currentLevel);
    }

    // Move to next question or end the level
    if (currentQuestionIndex < questions[currentLevel].length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        askQuestion(currentLevel, currentQuestionIndex + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        addBotMessage(`You've completed all questions for Level ${currentLevel}! Great job!`, currentLevel);
        setCurrentLevel(null);
        setCurrentQuestionIndex(0);
      }, 1500);
    }
  };

  return (
    <div className="chatbot-popup">
      <div className="chat-header">
        <div className="header-info">
          <h2>Math Learning Bot</h2>
        </div>
        <button 
          className="material-symbols-rounded toggle-levels"
          onClick={() => setShowLevels(!showLevels)}
        >
          {showLevels ? 'close' : 'menu'}
        </button>
      </div>

      {showLevels && (
        <div className="levels-panel">
          <h3>Select a Level</h3>
          {isLoading ? (
            <div className="loading-indicator">Loading levels...</div>
          ) : (
            <div className="levels-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <button
                  key={level}
                  className={`level-btn ${currentLevel === level ? 'active' : ''}`}
                  onClick={() => handleLevelSelect(level)}
                  disabled={isLoading}
                >
                  Level {level}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}-message`}>
            {message.sender === 'bot' && (
              <img src="/bot.png" alt="bot" className="bot-icon" />
            )}
            <div className="message-text">
              {message.text}
              {message.sender === 'bot' && message.level && currentQuestionIndex < questions[message.level]?.length && (
                <div className="quick-answers">
                  {questions[message.level][currentQuestionIndex]?.options?.map((option, i) => (
                    <button 
                      key={i} 
                      className="quick-answer-btn"
                      onClick={() => handleAnswer(option)}
                      disabled={isLoading}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <img src="/bot.png" alt="bot" className="bot-icon" />
            <div className="message-text">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <form onSubmit={handleSendMessage} className="chat-form">
          <input
            type="text"
            placeholder="Type your message..."
            className="message-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button material-symbols-rounded"
            disabled={isLoading}
          >
            arrow_upward
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;