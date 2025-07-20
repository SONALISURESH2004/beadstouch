import React from 'react';
import './dashboard.css';

const Dashboard = ({ userData }) => {
  // Safety check to prevent crash on undefined/null
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="dashboard-section">
      <div className="welcome-banner">
        <h2>Welcome back, {userData.username}!</h2>
        <p>Member since {userData.joinDate}</p>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>Course Progress</h3>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(userData.completedCourses / userData.totalCourses) * 100}%` }}
            ></div>
          </div>
          <p>{userData.completedCourses} of {userData.totalCourses} courses completed</p>
        </div>

        <div className="progress-card">
          <h3>Quiz Completion</h3>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(userData.completedQuizzes / userData.totalQuizzes) * 100}%` }}
            ></div>
          </div>
          <p>{userData.completedQuizzes} of {userData.totalQuizzes} quizzes completed</p>
        </div>

        <div className="progress-card">
          <h3>Accuracy</h3>
          <div className="accuracy-display">
            <span className="accuracy-value">{userData.accuracy}%</span>
          </div>
          <p>Overall quiz accuracy</p>
        </div>
      </div>

      <div className="knowledge-graph-section">
        <h2>Knowledge Graph</h2>
        <div className="knowledge-graph">
          {Object.entries(userData.knowledgeGraph || {}).map(([topic, score]) => (
            <div key={topic} className="knowledge-topic">
              <div className="topic-name">{topic}</div>
              <div className="topic-bar-container">
                <div 
                  className="topic-bar-fill" 
                  style={{ width: `${score}%` }}
                  data-score={score}
                ></div>
              </div>
              <div className="topic-score">{score}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Daily Activity</h3>
          <div className="bar-chart">
            {(userData.dailyProgress || []).map((day) => (
              <div key={day.day} className="bar-chart-item">
                <div 
                  className="bar" 
                  style={{ height: `${day.value * 10}px` }}
                ></div>
                <span>{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Monthly Progress</h3>
          <div className="line-chart">
            <svg viewBox="0 0 300 150">
              <polyline
                fill="none"
                stroke="#3a86ff"
                strokeWidth="3"
                points={(userData.monthlyProgress || [])
                  .map((month, index) => 
                    `${(index * 50) + 25},${150 - (month.value * 5)}`
                  )
                  .join(' ')}
              />
              {(userData.monthlyProgress || []).map((month, index) => (
                <React.Fragment key={month.month}>
                  <circle
                    cx={(index * 50) + 25}
                    cy={150 - (month.value * 5)}
                    r="4"
                    fill="#3a86ff"
                  />
                  <text
                    x={(index * 50) + 25}
                    y="145"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#666"
                  >
                    {month.month}
                  </text>
                </React.Fragment>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {(userData.recentActivities || []).map((activity) => (
              <tr key={activity.id}>
                <td>
                  <span className={`activity-type ${activity.type}`}>
                    {activity.type}
                  </span>
                </td>
                <td>{activity.title}</td>
                <td>{activity.date}</td>
                <td>{activity.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
