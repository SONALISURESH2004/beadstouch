import React, { useState, useEffect } from 'react';
import { ref, get, child } from 'firebase/database';
import { database } from './firebase';
import './quizsection.css';

const QuizSection = () => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch levels from Firebase
  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoading(true);
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'levels'));
        if (snapshot.exists()) {
          setLevels(Object.entries(snapshot.val()).map(([id, name]) => ({ id, name })));
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevels();
  }, []);

  // Fetch questions when level is selected
  useEffect(() => {
    if (selectedLevel) {
      const fetchQuestions = async () => {
        setIsLoading(true);
        try {
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `questions/level${selectedLevel}`));
          if (snapshot.exists()) {
            setQuestions(snapshot.val());
            setUserAnswers({});
            setScore(null);
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [selectedLevel]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer.trim()
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (userAnswers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()) {
        correct++;
      }
    });
    setScore({
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    });
  };

  const resetQuiz = () => {
    setSelectedLevel(null);
    setQuestions([]);
    setUserAnswers({});
    setScore(null);
  };

  return (
    <div className="quiz-container">
      {!selectedLevel ? (
        <div className="levels-selection">
          <h2>Choose Your Abacus Level</h2>
          {isLoading ? (
            <div className="loader">Loading levels...</div>
          ) : (
            <div className="levels-grid">
              {levels.map(level => (
                <div 
                  key={level.id} 
                  className="level-card"
                  onClick={() => setSelectedLevel(level.id)}
                >
                  <div className="level-number">Level {level.id}</div>
                  <div className="level-name">{level.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="quiz-interface">
          <button className="back-button" onClick={resetQuiz}>
            &larr; Back to Levels
          </button>
          
          <h2>Level {selectedLevel} Quiz</h2>
          
          {isLoading ? (
            <div className="loader">Loading questions...</div>
          ) : (
            <>
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={question.id} className="question-card">
                    <div className="question-header">
                      <span className="question-number">Q{index + 1}</span>
                      <p className="question-text">{question.text}</p>
                    </div>
                    <input
                      type="text"
                      value={userAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Type your answer..."
                      className="answer-input"
                    />
                  </div>
                ))}
              </div>
              
              <button 
                onClick={calculateScore}
                className="submit-button"
                disabled={Object.keys(userAnswers).length !== questions.length || questions.length === 0}
              >
                Submit Answers
              </button>
              
              {score && (
                <div className={`score-display ${score.percentage >= 70 ? 'pass' : 'fail'}`}>
                  <h3>
                    Your Score: {score.correct}/{score.total} 
                    <span> ({score.percentage}%)</span>
                  </h3>
                  <p>
                    {score.percentage >= 70 
                      ? '🎉 Excellent work! Ready for the next level!'
                      : '💪 Keep practicing! Review and try again.'}
                  </p>
                  <button 
                    className="try-again-button"
                    onClick={() => {
                      setUserAnswers({});
                      setScore(null);
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizSection;